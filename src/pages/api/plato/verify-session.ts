import type { APIRoute } from 'astro';
import { handlePlatoVerifySession } from '../../../lib/plato-verify-session';

export const prerender = false;

/**
 * Tras el Payment Link, Stripe redirige a /plato?session_id=cs_...
 * El cliente llama aquí para validar el pago antes de poner la cookie.
 */
export const POST: APIRoute = async ({ request }) => {
  let body: { sessionId?: string };
  try {
    body = await request.json();
  } catch {
    return jsonResponse(
      { ok: false, error: 'Petición no válida' },
      400,
    );
  }

  const result = await handlePlatoVerifySession(body);
  return jsonResponse(result.body, result.status);
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
