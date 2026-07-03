import type { APIRoute } from 'astro';
import {
  isAuthorizedCron,
  runSyntheticLeadWriteTest,
  sendFormAlert,
} from '../../../lib/form-monitor';

export const prerender = false;

/** Prueba real de escritura en Supabase, 1×/día. Solo alerta si falla. */
export const GET: APIRoute = async ({ request }) => {
  if (!isAuthorizedCron(request)) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const result = await runSyntheticLeadWriteTest();

  if (!result.ok) {
    console.error('check-lead-form failed:', result.reason);
    try {
      await sendFormAlert(result.reason ?? 'Error desconocido');
    } catch (err) {
      console.error('No se pudo enviar alerta:', err);
      return new Response(
        JSON.stringify({ ok: false, reason: result.reason, alertSent: false }),
        { status: 500, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({ ok: false, reason: result.reason, alertSent: true }),
      { status: 503, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
