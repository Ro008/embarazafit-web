import type { APIRoute } from 'astro';
import { handlePlatoAccess } from '../../../lib/plato-access-api';

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
    return jsonResponse(
      { ok: false, error: 'Petición no válida' },
      400,
    );
  }

  const result = await handlePlatoAccess(body);
  return jsonResponse(result.body, result.status);
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
