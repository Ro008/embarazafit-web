import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { getRequiredEnv } from './env';
import type { Lead, Pago } from './leads';
import type { PlatoCompra } from './plato-compras';
import {
  generatePlatoAccessToken,
  normalizePlatoEmail,
} from './plato-compras';

let client: SupabaseClient | null = null;

const LEADS_TABLE = 'embarazafit_leads';
const PAGOS_TABLE = 'embarazafit_pagos';
const PLATO_COMPRAS_TABLE = 'embarazafit_plato_compras';

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

export async function deleteLead(id: string): Promise<void> {
  const { error } = await getSupabase()
    .from(LEADS_TABLE)
    .delete()
    .eq('id', id);

  if (error) throw error;
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

export async function insertPlatoCompra(data: {
  stripe_session_id: string;
  email: string | null;
  customer_name: string | null;
  importe: number;
  currency: string;
  created_at?: string;
}): Promise<{ inserted: boolean; compra?: PlatoCompra }> {
  const email = data.email ? normalizePlatoEmail(data.email) : null;
  const access_token = generatePlatoAccessToken();

  const { data: compra, error } = await getSupabase()
    .from(PLATO_COMPRAS_TABLE)
    .insert({
      ...data,
      email,
      access_token,
    })
    .select()
    .single();

  if (error) {
    // Idempotencia: Stripe puede reenviar el mismo evento
    if (error.code === '23505') {
      return { inserted: false };
    }
    throw error;
  }

  return { inserted: true, compra: compra as PlatoCompra };
}

export async function markPlatoAccessEmailSent(
  id: string,
): Promise<void> {
  const { error } = await getSupabase()
    .from(PLATO_COMPRAS_TABLE)
    .update({ access_email_sent_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw error;
}

export async function findPlatoCompraByToken(
  token: string,
): Promise<PlatoCompra | null> {
  const trimmed = token.trim();
  if (!trimmed) return null;

  const { data, error } = await getSupabase()
    .from(PLATO_COMPRAS_TABLE)
    .select('*')
    .eq('access_token', trimmed)
    .maybeSingle();

  if (error) throw error;
  return (data as PlatoCompra | null) ?? null;
}

export async function findPlatoCompraByEmail(
  email: string,
): Promise<PlatoCompra | null> {
  const normalized = normalizePlatoEmail(email);
  if (!normalized) return null;

  // ilike sin wildcards = igualdad case-insensitive; escapamos % y _
  const pattern = normalized
    .replace(/\\/g, '\\\\')
    .replace(/%/g, '\\%')
    .replace(/_/g, '\\_');

  const { data, error } = await getSupabase()
    .from(PLATO_COMPRAS_TABLE)
    .select('*')
    .ilike('email', pattern)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return (data as PlatoCompra | null) ?? null;
}

/** Asegura que la compra tenga token (compras antiguas o edge cases). */
export async function ensurePlatoAccessToken(
  compra: PlatoCompra,
): Promise<PlatoCompra> {
  if (compra.access_token) return compra;

  const access_token = generatePlatoAccessToken();
  const { data, error } = await getSupabase()
    .from(PLATO_COMPRAS_TABLE)
    .update({ access_token })
    .eq('id', compra.id)
    .select()
    .single();

  if (error) throw error;
  return data as PlatoCompra;
}

export async function fetchPlatoCompras(): Promise<PlatoCompra[]> {
  const { data, error } = await getSupabase()
    .from(PLATO_COMPRAS_TABLE)
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data ?? []) as PlatoCompra[];
}
