import type { APIRoute } from 'astro';
import Stripe from 'stripe';
import {
  platoAccessEmailHtml,
  platoAccessEmailSubject,
} from '../../../lib/plato-access-email';
import { getEnv, getRequiredEnv } from '../../../lib/env';
import { sendMailrelayEmail } from '../../../lib/mailrelay';
import { PLATO_PRICE_CENTS } from '../../../lib/plato-config';
import {
  insertPlatoCompra,
  markPlatoAccessEmailSent,
} from '../../../lib/supabase';

export const prerender = false;

/** Solo para comprobar en el navegador que la ruta existe. Stripe usa POST. */
export const GET: APIRoute = async () => {
  return new Response(
    JSON.stringify({
      ok: true,
      message:
        'Webhook de Stripe activo. Este endpoint solo acepta POST desde Stripe.',
    }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    },
  );
};

/**
 * Webhook de Stripe: guarda compras del Plato Interactivo + email de acceso.
 * Evento: checkout.session.completed (Payment Links).
 */
export const POST: APIRoute = async ({ request }) => {
  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return new Response('Missing stripe-signature', { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'));
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      getRequiredEnv('STRIPE_WEBHOOK_SECRET'),
    );
  } catch (err) {
    console.error('stripe webhook signature error:', err);
    return new Response('Invalid signature', { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== 'paid') {
      return jsonOk({ skipped: 'not_paid' });
    }

    const amountTotal = session.amount_total ?? 0;
    const expectedCents = Number(
      getEnv('PLATO_STRIPE_AMOUNT_CENTS') ?? PLATO_PRICE_CENTS,
    );

    // Evita mezclar otros productos Stripe futuros con el Plato
    if (expectedCents > 0 && amountTotal !== expectedCents) {
      console.info(
        `stripe webhook: importe ${amountTotal} ≠ ${expectedCents}, omitido`,
      );
      return jsonOk({ skipped: 'amount_mismatch', amountTotal });
    }

    const importe = amountTotal / 100;
    if (importe <= 0) {
      return jsonOk({ skipped: 'zero_amount' });
    }

    const email =
      session.customer_details?.email ??
      session.customer_email ??
      null;
    const customerName = session.customer_details?.name ?? null;
    const createdAt = session.created
      ? new Date(session.created * 1000).toISOString()
      : undefined;

    try {
      const result = await insertPlatoCompra({
        stripe_session_id: session.id,
        email,
        customer_name: customerName,
        importe,
        currency: (session.currency ?? 'eur').toLowerCase(),
        created_at: createdAt,
      });

      if (
        result.inserted &&
        result.compra?.access_token &&
        result.compra.email
      ) {
        try {
          await sendMailrelayEmail({
            to: result.compra.email,
            toName: customerName ?? undefined,
            subject: platoAccessEmailSubject(customerName),
            html: platoAccessEmailHtml({
              token: result.compra.access_token,
              nombre: customerName,
            }),
          });
          await markPlatoAccessEmailSent(result.compra.id);
        } catch (mailErr) {
          // La compra ya está guardada: no fallar el webhook (Stripe reintentaría)
          console.error('stripe webhook access email error:', mailErr);
        }
      }

      return jsonOk({
        ok: true,
        inserted: result.inserted,
        sessionId: session.id,
        emailSent: Boolean(
          result.inserted && result.compra?.email && result.compra.access_token,
        ),
      });
    } catch (err) {
      console.error('stripe webhook insert error:', err);
      return new Response('Database error', { status: 500 });
    }
  }

  return jsonOk({ received: true, type: event.type });
};

function jsonOk(body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
