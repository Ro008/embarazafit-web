import { getMomentoLabel } from './leads';

export function escapeHtml(text: string): string {
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
    <p>
      Mientras tanto, si quieres empezar a organizarte desde hoy mismo, te dejo esto por aquí:
    </p>
    <p>
      🥗 <strong>El Plato Interactivo:</strong> La herramienta visual para montar tus comidas de
      forma fácil, rápida y mantener tu glucosa a raya sin pensar demasiado:
      <a href="https://www.embarazafit.com/plato">https://www.embarazafit.com/plato</a>
    </p>
    <p>Hasta pronto,</p>
    <p><strong>Rocío</strong><br><em>Creadora de EmbarazaFit</em></p>
  `;
}
