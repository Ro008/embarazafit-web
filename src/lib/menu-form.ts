/** Grupo «Default» de Mailrelay (newsletter). Se puede sobreescribir con MAILRELAY_NEWSLETTER_GROUP_IDS. */
export const DEFAULT_MAILRELAY_NEWSLETTER_GROUP_ID = 1;

export interface MenuPayload {
  nombre?: string;
  email?: string;
  hp_field?: string;
}

export interface ValidatedMenu {
  nombre?: string;
  email: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseMailrelayGroupIds(raw?: string): number[] {
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((part) => Number(part.trim()))
    .filter((id) => Number.isInteger(id) && id > 0);
}

export function newsletterGroupIds(rawEnv?: string): number[] {
  const parsed = parseMailrelayGroupIds(rawEnv);
  return parsed.length > 0 ? parsed : [DEFAULT_MAILRELAY_NEWSLETTER_GROUP_ID];
}

export function validateMenuPayload(
  body: MenuPayload,
): ValidatedMenu | { error: string } {
  const nombre = body.nombre?.trim() || undefined;
  const email = body.email?.trim().toLowerCase();

  if (nombre && nombre.length < 2) {
    return { error: 'Indica tu nombre.' };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { error: 'Indica un email válido.' };
  }

  return { nombre, email };
}
