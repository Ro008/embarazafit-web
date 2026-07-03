import type { APIRoute } from 'astro';
import { setAdminCookie } from '../../../lib/admin-auth';
import { getRequiredEnv } from '../../../lib/env';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = (await request.json()) as { password?: string };
    const password = body.password?.trim();

    if (!password || password !== getRequiredEnv('ADMIN_PASSWORD')) {
      return new Response(JSON.stringify({ error: 'Contraseña incorrecta' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    setAdminCookie(cookies);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'Error de autenticación' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
