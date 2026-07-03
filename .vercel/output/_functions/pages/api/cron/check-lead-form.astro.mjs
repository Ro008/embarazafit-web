import { i as isAuthorizedCron, r as runSyntheticLeadWriteTest, s as sendFormAlert } from '../../../chunks/form-monitor_CuhzHXyk.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ request }) => {
  if (!isAuthorizedCron(request)) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }
  const result = await runSyntheticLeadWriteTest();
  if (!result.ok) {
    console.error("check-lead-form failed:", result.reason);
    try {
      await sendFormAlert(result.reason ?? "Error desconocido");
    } catch (err) {
      console.error("No se pudo enviar alerta:", err);
      return new Response(
        JSON.stringify({ ok: false, reason: result.reason, alertSent: false }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ ok: false, reason: result.reason, alertSent: true }),
      { status: 503, headers: { "Content-Type": "application/json" } }
    );
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
