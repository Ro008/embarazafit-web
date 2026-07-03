import { g as getRequiredEnv, a as getEnv } from '../../chunks/env_CXdERRvH.mjs';
import { g as getMomentoLabel, M as MOMENTO_LABELS } from '../../chunks/leads_DcTapTfX.mjs';
import { a as insertLead } from '../../chunks/supabase_BoR_N1kR.mjs';
export { renderers } from '../../renderers.mjs';

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function leadDetailsHtml(data) {
  const situacion = data.situacion?.trim() ? escapeHtml(data.situacion.trim()) : "<em>No indicado</em>";
  return `
    <ul>
      <li><strong>Nombre:</strong> ${escapeHtml(data.nombre)}</li>
      <li><strong>Email:</strong> ${escapeHtml(data.email)}</li>
      <li><strong>Teléfono (WhatsApp):</strong> ${escapeHtml(data.telefono)}</li>
      <li><strong>Momento:</strong> ${escapeHtml(getMomentoLabel(data.momento))}</li>
      <li><strong>Situación / objetivos:</strong> ${situacion}</li>
    </ul>
  `;
}
function notificationEmailHtml(data, isTestMode = false) {
  const testNote = isTestMode ? `<p><em>(Modo prueba: en producción María recibiría un email aparte con estos datos para contactar a la clienta.)</em></p>` : "";
  return `
    <p>Hola,</p>
    <p>Has recibido una nueva solicitud de consulta con María desde Embarazafit.</p>
    ${leadDetailsHtml(data)}
    <p>Puedes ver el registro en tu dashboard: /dashboard</p>
    ${testNote}
  `;
}
function mariaLeadEmailHtml(data) {
  return `
    <p>Hola María,</p>
    <p>Una lectora de Embarazafit quiere consultar contigo el programa CÍCLICAS.</p>
    <p>Por favor, contáctala en los próximos días por WhatsApp para coordinar.</p>
    ${leadDetailsHtml(data)}
  `;
}

async function sendMailrelayEmail(options) {
  const apiUrl = getRequiredEnv("MAILRELAY_API_URL").replace(/\/$/, "");
  const apiKey = getRequiredEnv("MAILRELAY_API_KEY");
  const fromEmail = getRequiredEnv("MAILRELAY_FROM_EMAIL");
  const fromName = getRequiredEnv("MAILRELAY_FROM_NAME");
  const response = await fetch(`${apiUrl}/api/v1/send_emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-AUTH-TOKEN": apiKey
    },
    body: JSON.stringify({
      from: { email: fromEmail, name: fromName },
      to: [{ email: options.to, name: options.toName ?? options.to }],
      subject: options.subject,
      html_part: options.html
    })
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Mailrelay error (${response.status}): ${text}`);
  }
}

const prerender = false;
function validatePayload(body) {
  const nombre = body.nombre?.trim();
  const email = body.email?.trim().toLowerCase();
  const telefono = body.telefono?.trim();
  const momento = body.momento?.trim();
  const situacion = body.situacion?.trim() || null;
  if (!nombre || nombre.length < 2) {
    return { error: "Indica tu nombre completo." };
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: "Indica un email válido." };
  }
  if (!telefono || telefono.length < 9) {
    return { error: "Indica un teléfono válido con WhatsApp." };
  }
  if (!momento || !MOMENTO_LABELS[momento]) {
    return { error: "Selecciona en qué momento te encuentras." };
  }
  if (!body.consentimiento) {
    return { error: "Debes aceptar compartir tus datos con María." };
  }
  return { nombre, email, telefono, momento, situacion };
}
const POST = async ({ request }) => {
  try {
    const body = await request.json();
    const validated = validatePayload(body);
    if ("error" in validated) {
      return new Response(JSON.stringify({ error: validated.error }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }
    await insertLead(validated);
    const notificationEmail = getRequiredEnv("NOTIFICATION_EMAIL");
    const mariaEmail = getEnv("MARIA_NUTRICIONISTA_EMAIL") || notificationEmail;
    const isTestMode = mariaEmail === notificationEmail;
    const emailErrors = [];
    try {
      await sendMailrelayEmail({
        to: notificationEmail,
        subject: `[Embarazafit] Nueva solicitud de consulta — ${validated.nombre}`,
        html: notificationEmailHtml(validated, isTestMode)
      });
    } catch (err) {
      console.error("Error email notificación:", err);
      emailErrors.push("notificación");
    }
    if (!isTestMode) {
      try {
        await sendMailrelayEmail({
          to: mariaEmail,
          toName: "María",
          subject: `[Embarazafit] Nueva clienta interesada — ${validated.nombre}`,
          html: mariaLeadEmailHtml(validated)
        });
      } catch (err) {
        console.error("Error email María:", err);
        emailErrors.push("maría");
      }
    }
    if (emailErrors.length > 0) {
      console.warn("Lead guardado pero falló email:", emailErrors.join(", "));
    }
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("consulta-nutricionista error:", err);
    return new Response(
      JSON.stringify({
        error: "No se pudo procesar la solicitud. Inténtalo de nuevo más tarde."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
