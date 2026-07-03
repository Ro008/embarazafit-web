import { createHash } from 'node:crypto';
import { a as getEnv, g as getRequiredEnv } from './env_CXdERRvH.mjs';

const ADMIN_COOKIE = "embarazafit_admin";
function hashAdminPassword(password) {
  return createHash("sha256").update(`embarazafit-admin:${password}`).digest("hex");
}
function getAdminToken() {
  const password = getRequiredEnv("ADMIN_PASSWORD");
  return hashAdminPassword(password);
}
function isAdminAuthed(cookies) {
  const session = cookies.get(ADMIN_COOKIE)?.value;
  if (!session) return false;
  const password = getEnv("ADMIN_PASSWORD");
  if (!password) return false;
  return session === hashAdminPassword(password);
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
