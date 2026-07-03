import { getMomentoLabel } from './leads';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** Primer nombre para emails a la clienta (ej. «Marta Sánchez» → «Marta»). */
export function getFirstName(fullName: string): string {
  const first = fullName.trim().split(/\s+/)[0];
  return first || fullName.trim();
}

interface LeadEmailData {
  nombre: string;
  email: string;
  telefono: string;
  momento: string;
  situacion: string | null;
}

function leadDetailsHtml(data: LeadEmailData): string {
  const situacion = data.situacion?.trim()
    ? escapeHtml(data.situacion.trim())
    : '<em>No indicado</em>';

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

export function notificationEmailHtml(
  data: LeadEmailData,
  isTestMode = false,
): string {
  const testNote = isTestMode
    ? `<p><em>(Modo prueba: en producción María recibiría un email aparte con estos datos para contactar a la clienta.)</em></p>`
    : '';

  return `
    <p>Hola Ro,</p>
    <p>Has recibido una nueva solicitud de consulta con María desde Embarazafit.</p>
    ${leadDetailsHtml(data)}
    <p>Puedes ver el registro en tu dashboard: /dashboard</p>
    ${testNote}
  `;
}

export function mariaLeadEmailHtml(data: LeadEmailData): string {
  return `
    <p>Hola María,</p>
    <p>Una lectora de Embarazafit quiere consultar contigo el programa CÍCLICAS.</p>
    <p>Por favor, contáctala en los próximos días por WhatsApp para coordinarte con ella.</p>
    ${leadDetailsHtml(data)}
  `;
}

export function leadConfirmationSubject(nombre: string): string {
  const firstName = getFirstName(nombre);
  return `¡Todo listo, ${firstName}! Estás en las mejores manos 💚`;
}

export function leadConfirmationEmailHtml(nombre: string): string {
  const firstName = escapeHtml(getFirstName(nombre));

  return `
    <p>Hola, ${firstName}:</p>
    <p>
      Solo quería confirmarte que he recibido tus datos y ya le he pasado el aviso a María.
      Es una nutricionista maravillosa y súper profesional; da igual en qué semana o momento
      te encuentres, sé que te va a acompañar con muchísimo cariño, sin juzgar y adaptándose
      a tu vida real.
    </p>
    <p>En las próximas horas te escribirá por WhatsApp para que charléis tranquilas.</p>
    <p><strong>Mientras tanto, te dejo dos recursos que te pueden ayudar:</strong></p>
    <ul>
      <li>
        👶 <strong>Mi Plan de Parto Interactivo:</strong> Para organizar tus decisiones de forma
        visual y sin agobios:
        <a href="https://www.embarazafit.com/plan-de-parto">https://www.embarazafit.com/plan-de-parto</a>.
      </li>
      <li>
        📸 <strong>Comunidad en Instagram:</strong> Nos vemos en
        <a href="https://www.instagram.com/embarazafit">@embarazafit</a>
        donde hablo de las cositas buenas y no tan buenas de la maternidad. Porque estar
        embarazada es maravilloso, pero a veces es un poquito una 💩.
      </li>
    </ul>
    <p>Hasta pronto,</p>
    <p><strong>Rocío</strong><br><em>Creadora de EmbarazaFit</em></p>
  `;
}
