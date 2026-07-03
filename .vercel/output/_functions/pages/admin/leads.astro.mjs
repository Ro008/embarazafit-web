import { e as createAstro, f as createComponent, k as renderHead, l as renderScript, r as renderTemplate, n as renderComponent, h as addAttribute, o as Fragment } from '../../chunks/astro/server_C3u6mnmk.mjs';
import 'kleur/colors';
import { i as isAdminAuthed } from '../../chunks/admin-auth_DH5dIX0_.mjs';
import { f as fetchLeadsWithPagos } from '../../chunks/supabase_Cx9qJxwH.mjs';
import { c as commissionForAmount, f as formatEuro, C as COMMISSION_RATE, g as getMomentoLabel } from '../../chunks/leads_YxVkUCuL.mjs';
/* empty css                                    */
export { renderers } from '../../renderers.mjs';

const $$Astro = createAstro("https://www.embarazafit.com");
const prerender = false;
const $$Leads = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Leads;
  const authed = isAdminAuthed(Astro2.cookies);
  const mesActual = (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
  let leads = [];
  let loadError = null;
  if (authed) {
    try {
      leads = await fetchLeadsWithPagos();
    } catch {
      loadError = "No se pudieron cargar los leads. Revisa Supabase y las variables de entorno.";
    }
  }
  const pagosDelMes = leads.flatMap(
    (l) => l.pagos.filter((p) => p.mes === mesActual)
  );
  const comisionMes = pagosDelMes.reduce(
    (sum, p) => sum + commissionForAmount(Number(p.importe)),
    0
  );
  const statusLabels = {
    nuevo: "Nuevo",
    enviado: "Enviado a Mar\xEDa",
    en_tratamiento: "En tratamiento",
    cerrado: "Cerrado"
  };
  return renderTemplate`<html lang="es"> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta name="robots" content="noindex, nofollow"><title>Leads — Embarazafit Admin</title><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap">${renderHead()}</head> <body> <div class="admin-wrap"> <header class="admin-header"> <h1>Leads — Consulta nutrición</h1> ${authed && renderTemplate`<button type="button" id="logout-btn" class="btn-secondary">
Cerrar sesión
</button>`} </header> ${!authed ? renderTemplate`<section class="login-card"> <h2>Acceso privado</h2> <p id="login-error" class="error-msg" hidden></p> <form id="login-form"> <label for="password">Contraseña</label> <input type="password" id="password" name="password" required autocomplete="current-password"> <button type="submit" class="btn-primary">Entrar</button> </form> </section>` : loadError ? renderTemplate`<p class="error-msg">${loadError}</p>` : renderTemplate`${renderComponent($$result, "Fragment", Fragment, {}, { "default": async ($$result2) => renderTemplate` <section class="summary-card"> <h2>Comisión ${mesActual}</h2> <p class="summary-big">${formatEuro(comisionMes)}</p> <p class="summary-note"> ${Math.round(COMMISSION_RATE * 100)}% sobre ${pagosDelMes.length}${" "}
pago${pagosDelMes.length === 1 ? "" : "s"} registrado
${pagosDelMes.length === 1 ? "" : "s"} este mes
</p> </section> <section class="leads-section"> <h2>Leads (${leads.length})</h2> ${leads.length === 0 ? renderTemplate`<p class="empty">Aún no hay solicitudes.</p>` : renderTemplate`<div class="leads-list"> ${leads.map((lead) => renderTemplate`<article class="lead-card"${addAttribute(lead.id, "data-lead-id")}> <div class="lead-header"> <div> <h3>${lead.nombre}</h3> <p class="lead-date"> ${new Date(lead.created_at).toLocaleString("es-ES")} </p> </div> <select class="status-select"${addAttribute(lead.id, "data-lead-id")} aria-label="Estado del lead"> ${Object.entries(statusLabels).map(([value, label]) => renderTemplate`<option${addAttribute(value, "value")}${addAttribute(lead.status === value, "selected")}> ${label} </option>`)} </select> </div> <ul class="lead-details"> <li> <strong>Email:</strong>${" "} <a${addAttribute(`mailto:${lead.email}`, "href")}>${lead.email}</a> </li> <li> <strong>Teléfono:</strong>${" "} <a${addAttribute(`https://wa.me/${lead.telefono.replace(/\D/g, "")}`, "href")} target="_blank" rel="noopener noreferrer"> ${lead.telefono} </a> </li> <li> <strong>Momento:</strong> ${getMomentoLabel(lead.momento)} </li> ${lead.situacion && renderTemplate`<li> <strong>Situación:</strong> ${lead.situacion} </li>`} </ul> ${lead.pagos.length > 0 && renderTemplate`<div class="pagos-list"> <strong>Pagos registrados:</strong> <ul> ${lead.pagos.map((p) => renderTemplate`<li> ${p.mes} — ${formatEuro(Number(p.importe))} (
${p.tipo}) → comisión${" "} ${formatEuro(commissionForAmount(Number(p.importe)))} </li>`)} </ul> </div>`} <details class="add-pago"> <summary>Registrar pago</summary> <form class="pago-form"${addAttribute(lead.id, "data-lead-id")}> <div class="pago-fields"> <label>
Mes
<input type="month" name="mes"${addAttribute(mesActual, "value")} required> </label> <label>
Importe (€)
<input type="number" name="importe" min="0.01" step="0.01" required> </label> <label>
Tipo
<select name="tipo" required> <option value="fraccionado">Fraccionado</option> <option value="completo">Completo</option> </select> </label> </div> <button type="submit" class="btn-secondary">
Guardar pago
</button> </form> </details> </article>`)} </div>`} </section> ` })}`} </div> ${renderScript($$result, "C:/Users/User/Dropbox/side projects/embarazafit-web/src/pages/admin/leads.astro?astro&type=script&index=0&lang.ts")} </body> </html> `;
}, "C:/Users/User/Dropbox/side projects/embarazafit-web/src/pages/admin/leads.astro", void 0);

const $$file = "C:/Users/User/Dropbox/side projects/embarazafit-web/src/pages/admin/leads.astro";
const $$url = "/admin/leads";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Leads,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
