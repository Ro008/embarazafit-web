import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getRequiredEnv } from './env';
import type { Lead, Pago } from './leads';

let client: SupabaseClient | null = null;

const LEADS_TABLE = 'embarazafit_leads';
const PAGOS_TABLE = 'embarazafit_pagos';

export function getSupabase(): SupabaseClient {
  if (!client) {
    client = createClient(
      getRequiredEnv('SUPABASE_URL'),
      getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY'),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );
  }
  return client;
}

export async function insertLead(data: {
  nombre: string;
  email: string;
  telefono: string;
  momento: string;
  situacion: string | null;
}): Promise<Lead> {
  const { data: lead, error } = await getSupabase()
    .from(LEADS_TABLE)
    .insert({ ...data, status: 'nuevo' })
    .select()
    .single();

  if (error) throw error;
  return lead as Lead;
}

export async function fetchLeadsWithPagos(): Promise<
  (Lead & { pagos: Pago[] })[]
> {
  const { data: leads, error: leadsError } = await getSupabase()
    .from(LEADS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (leadsError) throw leadsError;

  const { data: pagos, error: pagosError } = await getSupabase()
    .from(PAGOS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (pagosError) throw pagosError;

  const pagosByLead = new Map<string, Pago[]>();
  for (const pago of (pagos ?? []) as Pago[]) {
    const list = pagosByLead.get(pago.lead_id) ?? [];
    list.push(pago);
    pagosByLead.set(pago.lead_id, list);
  }

  return ((leads ?? []) as Lead[]).map((lead) => ({
    ...lead,
    pagos: pagosByLead.get(lead.id) ?? [],
  }));
}

export async function fetchPagosForLead(leadId: string): Promise<Pago[]> {
  const { data, error } = await getSupabase()
    .from(PAGOS_TABLE)
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: true });

  if (error) throw error;
  return (data ?? []) as Pago[];
}

export async function insertPago(data: {
  lead_id: string;
  mes: string;
  importe: number;
  tipo: 'fraccionado' | 'completo';
}): Promise<Pago> {
  const { data: pago, error } = await getSupabase()
    .from(PAGOS_TABLE)
    .insert(data)
    .select()
    .single();

  if (error) throw error;
  return pago as Pago;
}

export async function updateLeadStatus(
  id: string,
  status: Lead['status'],
): Promise<void> {
  const { error } = await getSupabase()
    .from(LEADS_TABLE)
    .update({ status })
    .eq('id', id);

  if (error) throw error;
}
