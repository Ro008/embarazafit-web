export const COMMISSION_RATE = 0.17;

export const MOMENTO_LABELS: Record<string, string> = {
  'embarazo-primeras': 'Estoy embarazada (primeras semanas)',
  'embarazo-segundo-tercer': 'Estoy embarazada (segundo/tercer trimestre)',
  posparto: 'Estoy en pleno posparto',
  'busqueda-embarazo': 'Estoy buscando el embarazo / Salud hormonal',
};

export type LeadStatus = 'nuevo' | 'enviado' | 'en_tratamiento' | 'cerrado';

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

export function commissionForAmount(amount: number): number {
  return Math.round(amount * COMMISSION_RATE * 100) / 100;
}
