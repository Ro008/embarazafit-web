export const COMMISSION_RATE = 0.17;

export const MOMENTO_LABELS: Record<string, string> = {
  'embarazo-primeras': 'Estoy embarazada (primeras semanas)',
  'embarazo-segundo-tercer': 'Estoy embarazada (segundo/tercer trimestre)',
  posparto: 'Estoy en pleno posparto',
  'busqueda-embarazo': 'Estoy buscando el embarazo / Salud hormonal',
};

export type LeadStatus = 'nuevo' | 'enviado' | 'en_tratamiento' | 'cerrado';

export const STATUS_LABELS: Record<LeadStatus, string> = {
  nuevo: 'Nueva',
  enviado: 'Pasada a María',
  en_tratamiento: 'Clienta (paga)',
  cerrado: 'No ha contratado',
};

export interface Lead {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  momento: string;
  situacion: string | null;
  status: LeadStatus;
  created_at: string;
}

export interface Pago {
  id: string;
  lead_id: string;
  mes: string;
  importe: number;
  tipo: 'fraccionado' | 'completo';
  created_at: string;
}

export function getMomentoLabel(value: string): string {
  return MOMENTO_LABELS[value] ?? value;
}

export function formatEuro(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
  }).format(amount);
}

/** Fecha corta para tablas: 03/07 */
export function formatShortDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  return `${day}/${month}`;
}

export function commissionForAmount(amount: number): number {
  return Math.round(amount * COMMISSION_RATE * 100) / 100;
}

const MAX_CUOTAS = 2;

/** Una clienta puede tener un pago único o hasta 2 cuotas (una por mes). */
export function canLeadAcceptMorePayments(pagos: Pago[]): boolean {
  if (pagos.some((p) => p.tipo === 'completo')) return false;
  if (pagos.filter((p) => p.tipo === 'fraccionado').length >= MAX_CUOTAS) {
    return false;
  }
  return true;
}

export function validateNewPago(
  existingPagos: Pago[],
  newPago: { mes: string; tipo: Pago['tipo'] },
): { ok: true } | { ok: false; error: string } {
  if (existingPagos.some((p) => p.mes === newPago.mes)) {
    return {
      ok: false,
      error: 'Ya hay un cobro registrado para esta clienta en este mes.',
    };
  }

  if (existingPagos.some((p) => p.tipo === 'completo')) {
    return {
      ok: false,
      error: 'Esta clienta ya tiene un pago único registrado.',
    };
  }

  const cuotas = existingPagos.filter((p) => p.tipo === 'fraccionado');
  if (cuotas.length >= MAX_CUOTAS) {
    return {
      ok: false,
      error: 'Esta clienta ya tiene las 2 cuotas registradas.',
    };
  }

  if (newPago.tipo === 'completo' && cuotas.length > 0) {
    return {
      ok: false,
      error:
        'No puedes registrar pago único: ya hay cuotas registradas para esta clienta.',
    };
  }

  return { ok: true };
}
