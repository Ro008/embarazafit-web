import { getMomentoLabel } from './leads';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
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
