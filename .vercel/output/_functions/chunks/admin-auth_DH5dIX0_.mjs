import { createHash } from 'node:crypto';
import { g as getRequiredEnv } from './env_jnO49ZIj.mjs';

const ADMIN_COOKIE = "embarazafit_admin";
function getAdminToken() {
  const password = getRequiredEnv("ADMIN_PASSWORD");
  return createHash("sha256").update(`embarazafit-admin:${password}`).digest("hex");
}
function isAdminAuthed(cookies) {
  return cookies.get(ADMIN_COOKIE)?.value === getAdminToken();
}
function setAdminCookie(cookies) {
  cookies.set(ADMIN_COOKIE, getAdminToken(), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}
function clearAdminCookie(cookies) {
  cookies.delete(ADMIN_COOKIE, { path: "/" });
}
function unauthorizedResponse() {
  return new Response(JSON.stringify({ error: "No autorizado" }), {
    status: 401,
    headers: { "Content-Type": "application/json" }
  });
}

export { clearAdminCookie as c, isAdminAuthed as i, setAdminCookie as s, unauthorizedResponse as u };
