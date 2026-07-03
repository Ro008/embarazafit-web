import { e as createAstro, f as createComponent, n as renderHead, l as renderScript, r as renderTemplate, k as renderComponent, o as Fragment, h as addAttribute } from '../chunks/astro/server_7ZiZdJHI.mjs';
import 'kleur/colors';
import { i as isAdminAuthed } from '../chunks/admin-auth_ommQd3NC.mjs';
import { a as getEnv } from '../chunks/env_CXdERRvH.mjs';
import { a as canLeadAcceptMorePayments, f as formatEuro, C as COMMISSION_RATE, c as commissionForAmount, b as formatShortDate, g as getMomentoLabel } from '../chunks/leads_BjpEd_Gs.mjs';
import { f as fetchLeadsWithPagos } from '../chunks/supabase_Dyg-IptV.mjs';
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
  const leadsPendientesCobro = leadsDelMes.filter(
    (l) => canLeadAcceptMorePayments(l.pagos) && !l.pagos.some((p) => p.mes === selectedMes)
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
María te dice quién ha contratado su consulta (le han pagado a
                  ella por Bizum) y cuánto ha cobrado de cada una.
</li> <li>
Registras aquí esos cobros → el dashboard calcula tu${" "} <strong>${Math.round(COMMISSION_RATE * 100)}%</strong> sobre lo
                  que María ha cobrado.
</li> </ol> </section> <details class="card pricing-card"> <summary>Precios del programa (referencia)</summary> <div class="pricing-grid"> <div> <h3>Pago único (Bizum)</h3> <p> <strong>Lanzamiento</strong> (1.er mes):${" "} ${formatEuro(PROGRAM_PRICING.completo.lanzamiento)} </p> <p> <strong>Oficial:</strong>${" "} ${formatEuro(PROGRAM_PRICING.completo.oficial)} </p> </div> <div> <h3>Pago en 2 cuotas (+${PROGRAM_PRICING.extraAplazado})</h3> <p>
Lanzamiento: ${formatEuro(PROGRAM_PRICING.aplazado.lanzamiento.total)}${" "}
→ 2 × ${formatEuro(PROGRAM_PRICING.aplazado.lanzamiento.cuota)} </p> <p>
Oficial: ${formatEuro(PROGRAM_PRICING.aplazado.oficial.total)} →
                    2 × ${formatEuro(PROGRAM_PRICING.aplazado.oficial.cuota)} </p> </div> </div> </details> <section class="card commission-card"> <h2>Cobros de María en ${mesLabel}</h2> <p class="big-number">${formatEuro(comisionMes)}</p> <p class="sub-note">Tu comisión (${Math.round(COMMISSION_RATE * 100)}%)</p> <ul class="stats-row"> <li> <strong>${formatEuro(totalCobrado)}</strong> cobrado por María
</li> <li> <strong>${cobrosDelMes.length}</strong>${" "} ${cobrosDelMes.length === 1 ? "pago registrado" : "pagos registrados"} </li> <li> <strong>${clientasConPago}</strong> clienta
${clientasConPago === 1 ? "" : "s"} </li> </ul> ${cobrosDelMes.length > 0 && renderTemplate`<ul class="cobros-list"> ${cobrosDelMes.map((p) => renderTemplate`<li> ${p.lead_nombre} — ${formatEuro(Number(p.importe))} ${p.tipo === "fraccionado" ? " (cuota)" : " (completo)"}
→ tu parte:${" "} ${formatEuro(commissionForAmount(Number(p.importe)))} </li>`)} </ul>`} <h3>Registrar un cobro que María te ha confirmado</h3> <p class="help-text">
Solo leads de ${mesLabel} sin cobro ya registrado este mes. Cada
                clienta: un pago único o hasta 2 cuotas (una por mes).
</p> <form id="cobro-global-form" class="cobro-form"> <input type="hidden" name="mes"${addAttribute(selectedMes, "value")}> <label>
Lead de este mes
<select name="lead_id" required${addAttribute(leadsPendientesCobro.length === 0, "disabled")}> <option value=""> ${leadsDelMes.length === 0 ? "No hay leads este mes" : leadsPendientesCobro.length === 0 ? "Todas tienen cobro registrado" : "Elige una lead\u2026"} </option> ${leadsPendientesCobro.map((l) => renderTemplate`<option${addAttribute(l.id, "value")}>${l.nombre}</option>`)} </select> </label> <label>
Qué ha pagado
<select name="preset" required> <option value="">Elige el importe…</option> ${PAYMENT_PRESETS.map((p) => renderTemplate`<option${addAttribute(p.id, "value")}${addAttribute(p.importe, "data-importe")}${addAttribute(p.tipo, "data-tipo")}> ${p.label} </option>`)} </select> </label> <button type="submit" class="btn-secondary">
Guardar cobro
</button> </form> </section> <section class="card leads-export-card"> <h2>
Leads captados en ${mesLabel} (${leadsDelMes.length})
</h2> <p class="help-text">
Captura esta tabla para enviársela a María a fin de mes.
</p> ${leadsDelMes.length === 0 ? renderTemplate`<p class="empty">Ningún lead este mes.</p>` : renderTemplate`<div class="table-wrap"> <table class="leads-table"> <thead> <tr> <th>#</th> <th>Fecha</th> <th>Nombre</th> <th>Teléfono</th> <th>Email</th> <th>Momento</th> <th>Notas</th> </tr> </thead> <tbody> ${leadsDelMes.map((lead, i) => renderTemplate`<tr> <td>${i + 1}</td> <td>${formatShortDate(lead.created_at)}</td> <td>${lead.nombre}</td> <td>${lead.telefono}</td> <td>${lead.email}</td> <td>${getMomentoLabel(lead.momento)}</td> <td>${lead.situacion || "\u2014"}</td> </tr>`)} </tbody> </table> </div>`} </section> ` })}`} </div> ${renderScript($$result, "C:/Users/User/Dropbox/side projects/embarazafit-web/src/pages/dashboard.astro?astro&type=script&index=0&lang.ts")} </body> </html> `;
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
