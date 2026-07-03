import { c as clearAdminCookie } from '../../../chunks/admin-auth_DH5dIX0_.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ cookies }) => {
  clearAdminCookie(cookies);
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
