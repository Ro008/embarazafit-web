import { getEnv, getRequiredEnv } from './env';
import { sendMailrelayEmail } from './mailrelay';
import { deleteLead, getSupabase, insertLead } from './supabase';

const LEADS_TABLE = 'embarazafit_leads';

export async function checkLeadFormDependencies(): Promise<{
  ok: boolean;
  reason?: string;
}> {
  try {
    getRequiredEnv('SUPABASE_URL');
    getRequiredEnv('SUPABASE_SERVICE_ROLE_KEY');
    getRequiredEnv('MAILRELAY_API_URL');
    getRequiredEnv('MAILRELAY_API_KEY');
    getRequiredEnv('NOTIFICATION_EMAIL');
  } catch {
    return { ok: false, reason: 'Faltan variables de entorno críticas' };
  }

  const { error } = await getSupabase()
    .from(LEADS_TABLE)
    .select('id')
    .limit(1);

  if (error) {
    return { ok: false, reason: 'Supabase no responde' };
  }

  return { ok: true };
}

/** Inserta un lead de prueba y lo borra al instante (misma ruta que el formulario real). */
export async function runSyntheticLeadWriteTest(): Promise<{
  ok: boolean;
  reason?: string;
}> {
  const deps = await checkLeadFormDependencies();
  if (!deps.ok) return deps;

  const stamp = Date.now();
  const lead = await insertLead({
    nombre: 'Monitor automático',
    email: `monitor+${stamp}@check.embarazafit.local`,
    telefono: '600000000',
    momento: 'posparto',
    situacion: 'Prueba automática — se elimina al instante.',
  });

  try {
    const { data, error } = await getSupabase()
      .from(LEADS_TABLE)
      .select('id')
      .eq('id', lead.id)
      .maybeSingle();

    if (error || !data) {
      return { ok: false, reason: 'No se pudo leer el lead de prueba' };
    }
  } finally {
    try {
      await deleteLead(lead.id);
    } catch (err) {
      console.error('No se pudo borrar el lead de prueba:', err);
    }
  }

  return { ok: true };
}

export async function sendFormAlert(reason: string): Promise<void> {
  const to = getRequiredEnv('NOTIFICATION_EMAIL');
  await sendMailrelayEmail({
    to,
    subject: '[ALERTA Embarazafit] Problema con el formulario de consulta',
    html: `<p>La comprobación automática ha fallado:</p><p><strong>${reason}</strong></p><p>Revisa Vercel, Supabase y Mailrelay cuanto antes. Mientras falle, podrías estar perdiendo leads.</p><p><a href="https://www.embarazafit.com/consulta-nutricionista">Formulario</a> · <a href="https://www.embarazafit.com/dashboard">Dashboard</a></p>`,
  });
}

export function isAuthorizedCron(request: Request): boolean {
  const secret = getEnv('CRON_SECRET');
  if (!secret) return false;
  const auth = request.headers.get('authorization');
  return auth === `Bearer ${secret}`;
}
