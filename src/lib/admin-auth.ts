import { createHash } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { getEnv, getRequiredEnv } from './env';

export const ADMIN_COOKIE = 'embarazafit_admin';

function hashAdminPassword(password: string): string {
  return createHash('sha256')
    .update(`embarazafit-admin:${password}`)
    .digest('hex');
}

export function getAdminToken(): string {
  const password = getRequiredEnv('ADMIN_PASSWORD');
  return hashAdminPassword(password);
}

export function isAdminAuthed(cookies: AstroCookies): boolean {
  const session = cookies.get(ADMIN_COOKIE)?.value;
  if (!session) return false;

  const password = getEnv('ADMIN_PASSWORD');
  if (!password) return false;

  return session === hashAdminPassword(password);
}

export function setAdminCookie(cookies: AstroCookies): void {
  cookies.set(ADMIN_COOKIE, getAdminToken(), {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearAdminCookie(cookies: AstroCookies): void {
  cookies.delete(ADMIN_COOKIE, { path: '/' });
}

export function unauthorizedResponse(): Response {
  return new Response(JSON.stringify({ error: 'No autorizado' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });
}
