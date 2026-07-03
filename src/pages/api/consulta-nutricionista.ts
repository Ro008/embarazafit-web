import type { APIRoute } from 'astro';
import { getEnv, getRequiredEnv } from '../../lib/env';
import {
  getFirstName,
  leadConfirmationEmailHtml,
  leadConfirmationSubject,
  mariaLeadEmailHtml,
  notificationEmailHtml,
} from '../../lib/email-templates';
import { validateLeadPayload } from '../../lib/lead-form';
import { mailrelayGap, sendMailrelayEmail } from '../../lib/mailrelay';
import { insertLead } from '../../lib/supabase';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = (await request.json()) as import('../../lib/lead-form').LeadPayload;
    const validated = validateLeadPayload(body);

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

    // Confirmación a la clienta primero (prioridad si Mailrelay limita envíos seguidos)
    try {
      await sendMailrelayEmail({
        to: validated.email,
        toName: getFirstName(validated.nombre),
        subject: leadConfirmationSubject(validated.nombre),
        html: leadConfirmationEmailHtml(validated.nombre),
      });
    } catch (err) {
      console.error('Error email confirmación lead:', err);
      emailErrors.push('confirmación');
    }

    await mailrelayGap();

    try {
      await sendMailrelayEmail({
        to: notificationEmail,
        subject: `[Embarazafit] Nuevo lead — ${validated.nombre}`,
        html: notificationEmailHtml(validated, isTestMode),
      });
    } catch (err) {
      console.error('Error email notificación:', err);
      emailErrors.push('notificación');
    }

    await mailrelayGap();

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
