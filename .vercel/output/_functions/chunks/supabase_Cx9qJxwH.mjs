import { createClient } from '@supabase/supabase-js';
import { g as getRequiredEnv } from './env_jnO49ZIj.mjs';

let client = null;
function getSupabase() {
  if (!client) {
    client = createClient(
      getRequiredEnv("SUPABASE_URL"),
      getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return client;
}
async function insertLead(data) {
  const { data: lead, error } = await getSupabase().from("leads").insert({ ...data, status: "nuevo" }).select().single();
  if (error) throw error;
  return lead;
}
async function fetchLeadsWithPagos() {
  const { data: leads, error: leadsError } = await getSupabase().from("leads").select("*").order("created_at", { ascending: false });
  if (leadsError) throw leadsError;
  const { data: pagos, error: pagosError } = await getSupabase().from("pagos").select("*").order("created_at", { ascending: false });
  if (pagosError) throw pagosError;
  const pagosByLead = /* @__PURE__ */ new Map();
  for (const pago of pagos ?? []) {
    const list = pagosByLead.get(pago.lead_id) ?? [];
    list.push(pago);
    pagosByLead.set(pago.lead_id, list);
  }
  return (leads ?? []).map((lead) => ({
    ...lead,
    pagos: pagosByLead.get(lead.id) ?? []
  }));
}
async function insertPago(data) {
  const { data: pago, error } = await getSupabase().from("pagos").insert(data).select().single();
  if (error) throw error;
  return pago;
}
async function updateLeadStatus(id, status) {
  const { error } = await getSupabase().from("leads").update({ status }).eq("id", id);
  if (error) throw error;
}

export { insertLead as a, fetchLeadsWithPagos as f, insertPago as i, updateLeadStatus as u };
