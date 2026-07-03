import { i as isAdminAuthed, u as unauthorizedResponse } from '../../../chunks/admin-auth_ommQd3NC.mjs';
import { u as updateLeadStatus, i as insertPago } from '../../../chunks/supabase_BoR_N1kR.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  if (!isAdminAuthed(cookies)) return unauthorizedResponse();
  try {
    const body = await request.json();
    if (body.action === "update_status") {
      const validStatuses = ["nuevo", "enviado", "en_tratamiento", "cerrado"];
      if (!body.lead_id || !body.status || !validStatuses.includes(body.status)) {
        return new Response(JSON.stringify({ error: "Datos inválidos" }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }
      await updateLeadStatus(
        body.lead_id,
        body.status
      );
      return new Response(JSON.stringify({ ok: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" }
      });
    }
    const importe = Number(body.importe);
    const tipo = body.tipo;
    const mes = body.mes?.trim();
    if (!body.lead_id || !mes || !/^\d{4}-\d{2}$/.test(mes)) {
      return new Response(JSON.stringify({ error: "Mes inválido (usa YYYY-MM)" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (!importe || importe <= 0) {
      return new Response(JSON.stringify({ error: "Importe inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    if (tipo !== "fraccionado" && tipo !== "completo") {
      return new Response(JSON.stringify({ error: "Tipo de pago inválido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    const pago = await insertPago({
      lead_id: body.lead_id,
      mes,
      importe,
      tipo
    });
    return new Response(JSON.stringify({ ok: true, pago }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("admin/pagos POST error:", err);
    return new Response(JSON.stringify({ error: "Error al guardar" }), {
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
