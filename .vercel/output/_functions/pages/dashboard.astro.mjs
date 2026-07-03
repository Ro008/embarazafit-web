import { e as createAstro, f as createComponent, n as renderHead, l as renderScript, r as renderTemplate, k as renderComponent, o as Fragment, h as addAttribute } from '../chunks/astro/server_7ZiZdJHI.mjs';
import 'kleur/colors';
import { i as isAdminAuthed } from '../chunks/admin-auth_ommQd3NC.mjs';
import { a as getEnv } from '../chunks/env_CXdERRvH.mjs';
import { f as formatEuro, C as COMMISSION_RATE, c as commissionForAmount, g as getMomentoLabel, S as STATUS_LABELS } from '../chunks/leads_DcTapTfX.mjs';
import { f as fetchLeadsWithPagos } from '../chunks/supabase_BoR_N1kR.mjs';
/* empty css                                     */
export { renderers } from '../renderers.mjs';

function isMariaEmailLive() {
  return Boolean(getEnv("MARIA_NUTRICIONISTA_EMAIL")?.trim());
}

const PROGRAM_PRICING = {
  completo: {
    lanzamiento: 497,
    oficial: 597
  },
  aplazado: {
    lanzamiento: { total: 550, cuota: 275},
    oficial: { total: 650, cuota: 325}
  },
  extraAplazado: "10%"};
const PAYMENT_PRESETS = [
  {
    id: "completo-lanzamiento",
    label: "Pago único — lanzamiento (497€)",
    importe: 497,
    tipo: "completo",
    descripcion: "Programa completo al precio de lanzamiento"
  },
  {
    id: "completo-oficial",
    label: "Pago único — oficial (597€)",
    importe: 597,
    tipo: "completo",
    descripcion: "Programa completo al precio oficial"
  },
  {
    id: "cuota-lanzamiento",
    label: "Una cuota — lanzamiento aplazado (275€)",
    importe: 275,
    tipo: "fraccionado",
    descripcion: "1 de 2 cuotas (total 550€ con +10%)"
  },
  {
    id: "cuota-oficial",
    label: "Una cuota — oficial aplazado (325€)",
    importe: 325,
    tipo: "fraccionado",
    descripcion: "1 de 2 cuotas (total 650€ con +10%)"
  }
];
function formatMonthLabel(mes) {
  const [year, month] = mes.split("-").map(Number);
  const date = new Date(year, month - 1, 1);
  const label = date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return label.charAt(0).toUpperCase() + label.slice(1);
}
function leadCaptureMonth(createdAt) {
  return createdAt.slice(0, 7);
}

const $$Astro = createAstro("https://www.embarazafit.com");
const prerender = false;
const $$Dashboard = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Dashboard;
  const mesActual = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
  const authed = isAdminAuthed(Astro2.cookies);
  const adminConfigured = Boolean(getEnv("ADMIN_PASSWORD"));
  const mariaEmailLive = isMariaEmailLive();
  const mesQuery = Astro2.url.searchParams.get("mes");
  const selectedMes = mesQuery && /^\d{4}-\d{2}$/.test(mesQuery) ? mesQuery : mesActual;
  const mesLabel = formatMonthLabel(selectedMes);
  let leads = [];
  let loadError = null;
  if (authed) {
    try {
      leads = await fetchLeadsWithPagos();
    } catch {
      loadError = "No se pudieron cargar los leads. Revisa Supabase y las variables de entorno.";
    }
  }
  const leadsDelMes = leads.filter(
    (l) => leadCaptureMonth(l.created_at) === selectedMes
  );
  const cobrosDelMes = leads.flatMap(
    (lead) => lead.pagos.filter((p) => p.mes === selectedMes).map((p) => ({
      ...p,
      lead_nombre: lead.nombre,
      lead_id: lead.id
    }))
  );
  const totalCobrado = cobrosDelMes.reduce(
    (sum, p) => sum + Number(p.importe),
    0
  );
  const comisionMes = commissionForAmount(totalCobrado);
  const clientasConPago = new Set(cobrosDelMes.map((p) => p.lead_id)).size;
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Dashboard — Embarazafit</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap">${renderHead()}</head> <body> <div class="admin-wrap"> <header class="admin-header"> <h1>Dashboard</h1> ${authed && renderTemplate`<button type="button" id="logout-btn" class="btn-secondary">
Cerrar sesión
</button>`} </header> ${!adminConfigured ? renderTemplate`<section class="card"> <h2>Configuración pendiente</h2> <p>
Añade <code>ADMIN_PASSWORD</code> en <code>.env</code> o Vercel.
</p> </section>` : !authed ? renderTemplate`<section class="card"> <h2>Acceso privado</h2> <p id="login-error" class="error-msg" hidden></p> <form id="login-form"> <label for="password">Contraseña</label> <input type="password" id="password" required> <button type="submit" class="btn-primary">Entrar</button> </form> </section>` : loadError ? renderTemplate`<p class="error-msg">${loadError}</p>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate`${!mariaEmailLive && renderTemplate`<section class="banner-warn" role="status"> <strong>Modo prueba:</strong> el email de María aún no está
                activado. Ver <code>docs/CONSULTA-NUTRICIONISTA.md</code>.
</section>`}<form method="get" class="month-bar card"> <label for="mes">Ver mes</label> <input type="month" id="mes" name="mes"${addAttribute(selectedMes, "value")} onchange="this.form.submit()"> <span class="month-hint">${mesLabel}</span> </form> <section class="card workflow-card"> <h2>Cómo trabajar con María</h2> <ol> <li>
Las chicas rellenan el formulario → aparecen abajo como${" "} <strong>leads captados</strong>.
</li> <li>
A fin de mes, le pasas a María la lista de leads de ese mes.
</li> <li>
María te dice cuántas se han convertido en clientas y cuánto
                  te han pagado (por Bizum).
</li> <li>
Registras aquí cada cobro → el dashboard calcula tu${" "} <strong>${Math.round(COMMISSION_RATE * 100)}%</strong>.
</li> </ol> </section> <details class="card pricing-card"> <summary>Precios del programa (referencia)</summary> <div class="pricing-grid"> <div> <h3>Pago único (Bizum)</h3> <p> <strong>Lanzamiento</strong> (1.er mes):${" "} ${formatEuro(PROGRAM_PRICING.completo.lanzamiento)} </p> <p> <strong>Oficial:</strong>${" "} ${formatEuro(PROGRAM_PRICING.completo.oficial)} </p> </div> <div> <h3>Pago en 2 cuotas (+${PROGRAM_PRICING.extraAplazado})</h3> <p>
Lanzamiento: ${formatEuro(PROGRAM_PRICING.aplazado.lanzamiento.total)}${" "}
→ 2 × ${formatEuro(PROGRAM_PRICING.aplazado.lanzamiento.cuota)} </p> <p>
Oficial: ${formatEuro(PROGRAM_PRICING.aplazado.oficial.total)} →
                    2 × ${formatEuro(PROGRAM_PRICING.aplazado.oficial.cuota)} </p> </div> </div> </details> <section class="card commission-card"> <h2>Cobros de María en ${mesLabel}</h2> <p class="big-number">${formatEuro(comisionMes)}</p> <p class="sub-note">Tu comisión (${Math.round(COMMISSION_RATE * 100)}%)</p> <ul class="stats-row"> <li> <strong>${formatEuro(totalCobrado)}</strong> cobrado por María
</li> <li> <strong>${cobrosDelMes.length}</strong> pago
${cobrosDelMes.length === 1 ? "" : "s"} registrado
${cobrosDelMes.length === 1 ? "" : "s"} </li> <li> <strong>${clientasConPago}</strong> clienta
${clientasConPago === 1 ? "" : "s"} </li> </ul> ${cobrosDelMes.length > 0 && renderTemplate`<ul class="cobros-list"> ${cobrosDelMes.map((p) => renderTemplate`<li> ${p.lead_nombre} — ${formatEuro(Number(p.importe))} ${p.tipo === "fraccionado" ? " (cuota)" : " (completo)"}
→ tu parte:${" "} ${formatEuro(commissionForAmount(Number(p.importe)))} </li>`)} </ul>`} <h3>Registrar un cobro que María te ha confirmado</h3> <p class="help-text">
Usa el mes seleccionado arriba (${mesLabel}) como mes del cobro.
</p> <form id="cobro-global-form" class="cobro-form"> <input type="hidden" name="mes"${addAttribute(selectedMes, "value")}> <label>
Clienta (lead)
<select name="lead_id" required> <option value="">Elige una clienta…</option> ${leads.map((l) => renderTemplate`<option${addAttribute(l.id, "value")}> ${l.nombre} (${leadCaptureMonth(l.created_at)})
</option>`)} </select> </label> <label>
Qué ha pagado
<select name="preset" required> <option value="">Elige el importe…</option> ${PAYMENT_PRESETS.map((p) => renderTemplate`<option${addAttribute(p.id, "value")}${addAttribute(p.importe, "data-importe")}${addAttribute(p.tipo, "data-tipo")}> ${p.label} </option>`)} </select> </label> <button type="submit" class="btn-secondary">
Guardar cobro
</button> </form> </section> <section class="card"> <h2>
Leads captados en ${mesLabel} (${leadsDelMes.length})
</h2> <p class="help-text">
Estas son las solicitudes del formulario de este mes. Pásaselas
                a María a fin de mes.
</p> ${leadsDelMes.length === 0 ? renderTemplate`<p class="empty">Ningún lead este mes.</p>` : renderTemplate`<div class="leads-list"> ${leadsDelMes.map((lead) => {
    const pagosLead = lead.pagos.filter(
      (p) => p.mes === selectedMes
    );
    return renderTemplate`<article class="lead-card"> <div class="lead-top"> <div> <h3>${lead.nombre}</h3> <p class="muted"> ${new Date(lead.created_at).toLocaleDateString(
      "es-ES"
    )} </p> </div> <select class="status-select"${addAttribute(lead.id, "data-lead-id")} aria-label="Estado"> ${Object.entries(STATUS_LABELS).map(
      ([value, label]) => renderTemplate`<option${addAttribute(value, "value")}${addAttribute(lead.status === value, "selected")}> ${label} </option>`
    )} </select> </div> <p> <a${addAttribute(`mailto:${lead.email}`, "href")}>${lead.email}</a> ${" \xB7 "} <a${addAttribute(`https://wa.me/${lead.telefono.replace(/\D/g, "")}`, "href")} target="_blank" rel="noopener noreferrer"> ${lead.telefono} </a> </p> <p class="muted">${getMomentoLabel(lead.momento)}</p> ${lead.situacion && renderTemplate`<p class="situacion">${lead.situacion}</p>`} ${pagosLead.length > 0 && renderTemplate`<p class="pago-ok">
✓ Cobro registrado:${" "} ${pagosLead.map((p) => formatEuro(Number(p.importe))).join(", ")} </p>`} <details class="quick-cobro"> <summary>Registrar cobro de esta clienta</summary> <form class="cobro-form lead-cobro-form"${addAttribute(lead.id, "data-lead-id")}> <input type="hidden" name="mes"${addAttribute(selectedMes, "value")}> <label>
Qué ha pagado
<select name="preset" required> <option value="">Elige…</option> ${PAYMENT_PRESETS.map((p) => renderTemplate`<option${addAttribute(p.id, "value")}>${p.label}</option>`)} </select> </label> <button type="submit" class="btn-secondary btn-sm">
Guardar
</button> </form> </details> </article>`;
  })} </div>`} </section> ` })}`} </div> ${renderScript($$result, "C:/Users/User/Dropbox/side projects/embarazafit-web/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts")} </body> </html> `;
}, "C:/Users/User/Dropbox/side projects/embarazafit-web/src/pages/dashboard.astro", void 0);

const $$file = "C:/Users/User/Dropbox/side projects/embarazafit-web/src/pages/dashboard.astro";
const $$url = "/dashboard";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Dashboard,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
