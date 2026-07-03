import { i as isAdminAuthed, u as unauthorizedResponse } from '../../../chunks/admin-auth_ommQd3NC.mjs';
import { c as commissionForAmount, f as formatEuro, g as getMomentoLabel } from '../../../chunks/leads_BjpEd_Gs.mjs';
import { f as fetchLeadsWithPagos } from '../../../chunks/supabase_Dyg-IptV.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies, url }) => {
  if (!isAdminAuthed(cookies)) return unauthorizedResponse();
  try {
    const leads = await fetchLeadsWithPagos();
    const mesFilter = url.searchParams.get("mes");
    const pagos = leads.flatMap(
      (lead) => lead.pagos.map((pago) => ({
        ...pago,
        lead_nombre: lead.nombre
      }))
    );
    const pagosFiltrados = mesFilter ? pagos.filter((p) => p.mes === mesFilter) : pagos;
    const comisionTotal = pagosFiltrados.reduce(
      (sum, p) => sum + commissionForAmount(Number(p.importe)),
      0
    );
    return new Response(
      JSON.stringify({
        leads: leads.map((lead) => ({
          ...lead,
          momento_label: getMomentoLabel(lead.momento)
        })),
        resumen: {
          mes: mesFilter,
          num_pagos: pagosFiltrados.length,
          comision_total: comisionTotal,
          comision_total_formatted: formatEuro(comisionTotal)
        }
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("admin/leads GET error:", err);
    return new Response(JSON.stringify({ error: "Error al cargar leads" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
