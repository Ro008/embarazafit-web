import { a as getEnv, g as getRequiredEnv } from './env_CXdERRvH.mjs';
import { s as sendMailrelayEmail } from './mailrelay_C_mkZ67k.mjs';
import { b as insertLead, g as getSupabase, d as deleteLead } from './supabase_Dyg-IptV.mjs';

const LEADS_TABLE = "embarazafit_leads";
async function checkLeadFormDependencies() {
  try {
    getRequiredEnv("SUPABASE_URL");
    getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
    getRequiredEnv("MAILRELAY_API_URL");
    getRequiredEnv("MAILRELAY_API_KEY");
    getRequiredEnv("NOTIFICATION_EMAIL");
  } catch {
    return { ok: false, reason: "Faltan variables de entorno críticas" };
  }
  const { error } = await getSupabase().from(LEADS_TABLE).select("id").limit(1);
  if (error) {
    return { ok: false, reason: "Supabase no responde" };
  }
  return { ok: true };
}
async function runSyntheticLeadWriteTest() {
  const deps = await checkLeadFormDependencies();
  if (!deps.ok) return deps;
  const stamp = Date.now();
  const lead = await insertLead({
    nombre: "Monitor automático",
    email: `monitor+${stamp}@check.embarazafit.local`,
    telefono: "600000000",
    momento: "posparto",
    situacion: "Prueba automática — se elimina al instante."
  });
  try {
    const { data, error } = await getSupabase().from(LEADS_TABLE).select("id").eq("id", lead.id).maybeSingle();
    if (error || !data) {
      return { ok: false, reason: "No se pudo leer el lead de prueba" };
    }
  } finally {
    try {
      await deleteLead(lead.id);
    } catch (err) {
      console.error("No se pudo borrar el lead de prueba:", err);
    }
  }
  return { ok: true };
}
async function sendFormAlert(reason) {
  const to = getRequiredEnv("NOTIFICATION_EMAIL");
  await sendMailrelayEmail({
    to,
    subject: "[ALERTA Embarazafit] Problema con el formulario de consulta",
    html: `<p>La comprobación automática ha fallado:</p><p><strong>${reason}</strong></p><p>Revisa Vercel, Supabase y Mailrelay cuanto antes. Mientras falle, podrías estar perdiendo leads.</p><p><a href="https://www.embarazafit.com/consulta-nutricionista">Formulario</a> · <a href="https://www.embarazafit.com/dashboard">Dashboard</a></p>`
  });
}
function isAuthorizedCron(request) {
  const secret = getEnv("CRON_SECRET");
  if (!secret) return false;
  const auth = request.headers.get("authorization");
  return auth === `Bearer ${secret}`;
}

export { checkLeadFormDependencies as c, isAuthorizedCron as i, runSyntheticLeadWriteTest as r, sendFormAlert as s };
