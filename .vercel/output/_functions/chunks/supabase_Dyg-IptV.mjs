import { createClient } from '@supabase/supabase-js';
import { g as getRequiredEnv } from './env_CXdERRvH.mjs';

let client = null;
const LEADS_TABLE = "embarazafit_leads";
const PAGOS_TABLE = "embarazafit_pagos";
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
  const { data: lead, error } = await getSupabase().from(LEADS_TABLE).insert({ ...data, status: "nuevo" }).select().single();
  if (error) throw error;
  return lead;
}
async function fetchLeadsWithPagos() {
  const { data: leads, error: leadsError } = await getSupabase().from(LEADS_TABLE).select("*").order("created_at", { ascending: false });
  if (leadsError) throw leadsError;
  const { data: pagos, error: pagosError } = await getSupabase().from(PAGOS_TABLE).select("*").order("created_at", { ascending: false });
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
async function fetchPagosForLead(leadId) {
  const { data, error } = await getSupabase().from(PAGOS_TABLE).select("*").eq("lead_id", leadId).order("created_at", { ascending: true });
  if (error) throw error;
  return data ?? [];
}
async function deleteLead(id) {
  const { error } = await getSupabase().from(LEADS_TABLE).delete().eq("id", id);
  if (error) throw error;
}
async function insertPago(data) {
  const { data: pago, error } = await getSupabase().from(PAGOS_TABLE).insert(data).select().single();
  if (error) throw error;
  return pago;
}
async function updateLeadStatus(id, status) {
  const { error } = await getSupabase().from(LEADS_TABLE).update({ status }).eq("id", id);
  if (error) throw error;
}

export { fetchPagosForLead as a, insertLead as b, deleteLead as d, fetchLeadsWithPagos as f, getSupabase as g, insertPago as i, updateLeadStatus as u };
