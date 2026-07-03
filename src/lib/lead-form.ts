import { MOMENTO_LABELS } from './leads';

export interface LeadPayload {
  nombre?: string;
  email?: string;
  telefono?: string;
  momento?: string;
  situacion?: string;
  consentimiento?: string;
}

export interface ValidatedLead {
  nombre: string;
  email: string;
  telefono: string;
  momento: string;
  situacion: string | null;
}

export function validateLeadPayload(
  body: LeadPayload,
): ValidatedLead | { error: string } {
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
