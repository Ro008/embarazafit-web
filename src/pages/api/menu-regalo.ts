import type { APIRoute } from 'astro';
import type { MenuPayload } from '../../lib/menu-form';
import { handleMenuRegalo } from '../../lib/menu-regalo-api';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let body: MenuPayload;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'Petición no válida' }, 400);
  }

  const result = await handleMenuRegalo(body);
  return jsonResponse(result.body, result.status);
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
