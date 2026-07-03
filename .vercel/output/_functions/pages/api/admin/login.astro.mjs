import { s as setAdminCookie } from '../../../chunks/admin-auth_ommQd3NC.mjs';
import { g as getRequiredEnv } from '../../../chunks/env_CXdERRvH.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const password = body.password?.trim();
    if (!password || password !== getRequiredEnv("ADMIN_PASSWORD")) {
      return new Response(JSON.stringify({ error: "Contraseña incorrecta" }), {
        status: 401,
        headers: { "Content-Type": "application/json" }
      });
    }
    setAdminCookie(cookies);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch {
    return new Response(JSON.stringify({ error: "Error de autenticación" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
