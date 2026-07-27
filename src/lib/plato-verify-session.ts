import Stripe from 'stripe';
import { getEnv, getRequiredEnv } from './env';
import { PLATO_PRICE_CENTS } from './plato-config';

export type PlatoVerifySessionResult = {
  status: number;
  body: Record<string, unknown>;
};

export type StripeSessionLookup = {
  retrieve(sessionId: string): Promise<Pick<
    Stripe.Checkout.Session,
    'id' | 'payment_status' | 'amount_total' | 'currency'
  >>;
};

function expectedPlatoCents(): number {
  return Number(getEnv('PLATO_STRIPE_AMOUNT_CENTS') ?? PLATO_PRICE_CENTS);
}

function createStripeLookup(): StripeSessionLookup {
  const stripe = new Stripe(getRequiredEnv('STRIPE_SECRET_KEY'));
  return {
    async retrieve(sessionId: string) {
      return stripe.checkout.sessions.retrieve(sessionId);
    },
  };
}

/**
 * Valida un Checkout Session ID de Stripe tras el pago.
 * Solo desbloquea si payment_status=paid y el importe es el del Plato.
 */
export async function handlePlatoVerifySession(
  body: { sessionId?: unknown },
  lookup: StripeSessionLookup = createStripeLookup(),
): Promise<PlatoVerifySessionResult> {
  const sessionId =
    typeof body.sessionId === 'string' ? body.sessionId.trim() : '';

  if (!sessionId) {
    return errorResult('Falta el identificador de la sesión de pago.', 400);
  }

  // Evita IDs inventados obvios / inyección rara
  if (!/^cs_[a-zA-Z0-9_]+$/.test(sessionId)) {
    return errorResult('Identificador de sesión no válido.', 400);
  }

  try {
    const session = await lookup.retrieve(sessionId);

    if (session.payment_status !== 'paid') {
      return errorResult(
        'El pago aún no está confirmado. Si acabas de pagar, espera unos segundos e inténtalo de nuevo.',
        402,
      );
    }

    const amountTotal = session.amount_total ?? 0;
    const expected = expectedPlatoCents();
    if (expected > 0 && amountTotal !== expected) {
      return errorResult(
        'Esta sesión de pago no corresponde al Plato Interactivo.',
        403,
      );
    }

    return {
      status: 200,
      body: { ok: true, method: 'stripe_session', sessionId: session.id },
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    // Stripe: recurso inexistente
    if (
      message.includes('No such checkout.session') ||
      message.includes('resource_missing')
    ) {
      return errorResult('No encontramos esa sesión de pago.', 404);
    }
    console.error('plato verify session error:', err);
    return errorResult(
      'No se pudo comprobar el pago. Inténtalo de nuevo.',
      500,
    );
  }
}

function errorResult(message: string, status: number): PlatoVerifySessionResult {
  return { status, body: { ok: false, error: message } };
}
