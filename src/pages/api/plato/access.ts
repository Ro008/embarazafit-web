import type { APIRoute } from 'astro';
import {
  platoAccessEmailHtml,
  platoAccessEmailSubject,
} from '../../../lib/plato-access-email';
import { sendMailrelayEmail } from '../../../lib/mailrelay';
import {
  ensurePlatoAccessToken,
  findPlatoCompraByEmail,
  findPlatoCompraByToken,
  markPlatoAccessEmailSent,
} from '../../../lib/supabase';

export const prerender = false;

/**
 * Acceso híbrido del Plato:
 * - { token } → valida magic link
 * - { email } → “Ya compré”: desbloquea + reenvía el enlace
 */
export const POST: APIRoute = async ({ request }) => {
  let body: { token?: string; email?: string };
  try {
    body = await request.json();
  } catch {
    return jsonError('Petición no válida', 400);
  }

  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (token) {
    try {
      const compra = await findPlatoCompraByToken(token);
      if (!compra) {
        return jsonError(
          'Este enlace de acceso no es válido. Prueba «Ya compré» con el email del pago o escríbeme a contacto@embarazafit.com.',
          404,
        );
      }
      return jsonOk({ ok: true, method: 'token' });
    } catch (err) {
      console.error('plato access token error:', err);
      return jsonError('No se pudo validar el acceso. Inténtalo de nuevo.', 500);
    }
  }

  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonError('Introduce un email válido.', 400);
    }

    try {
      const found = await findPlatoCompraByEmail(email);
      if (!found) {
        return jsonError(
          'No encontramos una compra con ese email. Revisa que sea el mismo del pago o escríbeme a contacto@embarazafit.com.',
          404,
        );
      }

      const compra = await ensurePlatoAccessToken(found);
      if (!compra.access_token) {
        return jsonError('No se pudo generar el acceso. Inténtalo de nuevo.', 500);
      }

      try {
        await sendMailrelayEmail({
          to: compra.email ?? email,
          toName: compra.customer_name ?? undefined,
          subject: platoAccessEmailSubject(compra.customer_name),
          html: platoAccessEmailHtml({
            token: compra.access_token,
            nombre: compra.customer_name,
          }),
        });
        await markPlatoAccessEmailSent(compra.id);
      } catch (mailErr) {
        // Desbloqueamos igual; el email es refuerzo
        console.error('plato recover email error:', mailErr);
      }

      return jsonOk({ ok: true, method: 'email', emailResent: true });
    } catch (err) {
      console.error('plato access email error:', err);
      return jsonError('No se pudo recuperar el acceso. Inténtalo de nuevo.', 500);
    }
  }

  return jsonError('Indica un email o un token de acceso.', 400);
};

function jsonOk(body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

function jsonError(message: string, status: number) {
  return new Response(JSON.stringify({ ok: false, error: message }), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
