import { escapeHtml, getFirstName } from './email-templates';
import { PLATO_SITE_ORIGIN, platoAccessUrl } from './plato-config';

export function platoAccessEmailSubject(nombre?: string | null): string {
  if (nombre?.trim()) {
    return `Tu acceso al Plato Interactivo, ${getFirstName(nombre)} 🍱`;
  }
  return 'Tu acceso al Plato Interactivo · Embarazafit';
}

export function platoAccessEmailHtml(options: {
  token: string;
  nombre?: string | null;
}): string {
  const accessLink = platoAccessUrl(options.token);
  const greeting = options.nombre?.trim()
    ? `Hola, ${escapeHtml(getFirstName(options.nombre))}:`
    : 'Hola:';

  return `
    <p>${greeting}</p>
    <p>
      Gracias por tu compra. Aquí tienes tu acceso al
      <strong>Simulador del Plato Interactivo</strong>.
    </p>
    <p>
      <a href="${accessLink}" style="display:inline-block;padding:12px 20px;background:#32a398;color:#f7f4ef;text-decoration:none;border-radius:9999px;font-weight:700;">
        Abrir mi Plato Interactivo
      </a>
    </p>
    <p style="font-size:0.9em;color:#555;">
      Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
      <a href="${accessLink}">${accessLink}</a>
    </p>
    <p>
      Guarda este email: el enlace funciona en el móvil, el ordenador o cualquier
      dispositivo. También puedes entrar en
      <a href="${PLATO_SITE_ORIGIN}/plato">${PLATO_SITE_ORIGIN}/plato</a>
      y pulsar <strong>«Ya compré»</strong> con el mismo email del pago.
    </p>
    <p>
      Si algo no va bien, escríbeme a
      <a href="mailto:contacto@embarazafit.com">contacto@embarazafit.com</a>
      y lo resolvemos.
    </p>
    <p>Hasta pronto,<br><strong>Rocío</strong><br><em>Creadora de EmbarazaFit</em></p>
  `;
}
