import type { APIRoute } from 'astro';
import { getEnv, getRequiredEnv } from '../../lib/env';
import {
  mariaLeadEmailHtml,
  notificationEmailHtml,
} from '../../lib/email-templates';
import { MOMENTO_LABELS } from '../../lib/leads';
import { sendMailrelayEmail } from '../../lib/mailrelay';
import { insertLead } from '../../lib/supabase';

export const prerender = false;

interface LeadPayload {
  nombre?: string;
  email?: string;
  telefono?: string;
  momento?: string;
  situacion?: string;
  consentimiento?: string;
}

function validatePayload(body: LeadPayload): {
  nombre: string;
  email: string;
  telefono: string;
  momento: string;
  situacion: string | null;
} | { error: string } {
  const nombre = body.nombre?.trim();
  const email = body.email?.trim().toLowerCase();
  const telefono = body.telefono?.trim();
  const momento = body.momento?.trim();
  const situacion = body.situacion?.trim() || null;

  if (!nombre || nombre.length < 2) {
    return { error: 'Indica tu nombre completo.' };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Indica un email válido.' };
  }
  if (!telefono || telefono.length < 9) {
    return { error: 'Indica un teléfono válido con WhatsApp.' };
  }
  if (!momento || !MOMENTO_LABELS[momento]) {
    return { error: 'Selecciona en qué momento te encuentras.' };
  }
  if (!body.consentimiento) {
    return { error: 'Debes aceptar compartir tus datos con María.' };
  }

  return { nombre, email, telefono, momento, situacion };
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as LeadPayload;
    const validated = validatePayload(body);

    if ('error' in validated) {
      return new Response(JSON.stringify({ error: validated.error }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await insertLead(validated);

    const notificationEmail = getRequiredEnv('NOTIFICATION_EMAIL');
    const mariaEmail =
      getEnv('MARIA_NUTRICIONISTA_EMAIL') || notificationEmail;
    const isTestMode = mariaEmail === notificationEmail;

    const emailErrors: string[] = [];

    try {
      await sendMailrelayEmail({
        to: notificationEmail,
        subject: `[Embarazafit] Nueva solicitud de consulta — ${validated.nombre}`,
        html: notificationEmailHtml(validated, isTestMode),
      });
    } catch (err) {
      console.error('Error email notificación:', err);
      emailErrors.push('notificación');
    }

    // En modo prueba ambos iban al mismo correo → Mailrelay falla en el 2.º envío
    if (!isTestMode) {
      try {
        await sendMailrelayEmail({
          to: mariaEmail,
          toName: 'María',
          subject: `[Embarazafit] Nueva clienta interesada — ${validated.nombre}`,
          html: mariaLeadEmailHtml(validated),
        });
      } catch (err) {
        console.error('Error email María:', err);
        emailErrors.push('maría');
      }
    }

    if (emailErrors.length > 0) {
      console.warn('Lead guardado pero falló email:', emailErrors.join(', '));
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('consulta-nutricionista error:', err);
    return new Response(
      JSON.stringify({
        error: 'No se pudo procesar la solicitud. Inténtalo de nuevo más tarde.',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    );
  }
};
