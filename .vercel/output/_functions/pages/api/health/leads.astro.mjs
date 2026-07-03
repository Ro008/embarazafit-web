import { c as checkLeadFormDependencies } from '../../../chunks/form-monitor_CuhzHXyk.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async () => {
  const result = await checkLeadFormDependencies();
  return new Response(JSON.stringify({ ok: result.ok }), {
    status: result.ok ? 200 : 503,
    headers: { "Content-Type": "application/json", "Cache-Control": "no-store" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
