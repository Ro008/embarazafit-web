import {
  platoAccessEmailHtml,
  platoAccessEmailSubject,
} from './plato-access-email';
import { sendMailrelayEmail } from './mailrelay';
import type { PlatoCompra } from './plato-compras';
import {
  ensurePlatoAccessToken,
  findPlatoCompraByEmail,
  findPlatoCompraByToken,
  markPlatoAccessEmailSent,
} from './supabase';

export type PlatoAccessResult = {
  status: number;
  body: Record<string, unknown>;
};

/**
 * Lógica de POST /api/plato/access (testeable sin Astro).
 * - { token } → valida magic link
 * - { email } → “Ya compré”: desbloquea + reenvía el enlace
 */
export async function handlePlatoAccess(
  body: { token?: unknown; email?: unknown },
): Promise<PlatoAccessResult> {
  const token = typeof body.token === 'string' ? body.token.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim() : '';

  if (token) {
    try {
      const compra = await findPlatoCompraByToken(token);
      if (!compra) {
        return errorResult(
          'Este enlace de acceso no es válido. Prueba «Ya compré» con el email del pago o escríbeme a contacto@embarazafit.com.',
          404,
        );
      }
      return okResult({ ok: true, method: 'token' });
    } catch (err) {
      console.error('plato access token error:', err);
      return errorResult('No se pudo validar el acceso. Inténtalo de nuevo.', 500);
    }
  }

  if (email) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return errorResult('Introduce un email válido.', 400);
    }

    try {
      const found = await findPlatoCompraByEmail(email);
      if (!found) {
        return errorResult(
          'No encontramos una compra con ese email. Revisa que sea el mismo del pago o escríbeme a contacto@embarazafit.com.',
          404,
        );
      }

      const compra = await ensurePlatoAccessToken(found);
      if (!compra.access_token) {
        return errorResult('No se pudo generar el acceso. Inténtalo de nuevo.', 500);
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

      return okResult({ ok: true, method: 'email', emailResent: true });
    } catch (err) {
      console.error('plato access email error:', err);
      return errorResult(
        'No se pudo recuperar el acceso. Inténtalo de nuevo.',
        500,
      );
    }
  }

  return errorResult('Indica un email o un token de acceso.', 400);
}

function okResult(body: Record<string, unknown>): PlatoAccessResult {
  return { status: 200, body };
}

function errorResult(message: string, status: number): PlatoAccessResult {
  return { status, body: { ok: false, error: message } };
}

/** Helper para tests / fixtures. */
export function mockPlatoCompra(
  overrides: Partial<PlatoCompra> = {},
): PlatoCompra {
  return {
    id: 'compra-1',
    stripe_session_id: 'cs_test_1',
    email: 'clienta@example.com',
    customer_name: 'Ana Pérez',
    importe: 6,
    currency: 'eur',
    access_token: 'tok_test_abc',
    access_email_sent_at: null,
    created_at: '2026-01-01T00:00:00.000Z',
    ...overrides,
  };
}
