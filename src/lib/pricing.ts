export const COMMISSION_RATE = 0.17;

/** Precios del programa CÍCLICAS (referencia para captación) */
export const PROGRAM_PRICING = {
  completo: {
    lanzamiento: 497,
    oficial: 597,
  },
  aplazado: {
    lanzamiento: { total: 550, cuota: 275, cuotas: 2 },
    oficial: { total: 650, cuota: 325, cuotas: 2 },
  },
  extraAplazado: '10%',
  metodoPago: 'Bizum',
} as const;

export type PaymentPresetId =
  | 'completo-lanzamiento'
  | 'completo-oficial'
  | 'cuota-lanzamiento'
  | 'cuota-oficial';

export interface PaymentPreset {
  id: PaymentPresetId;
  label: string;
  importe: number;
  tipo: 'completo' | 'fraccionado';
  descripcion: string;
}

export const PAYMENT_PRESETS: PaymentPreset[] = [
  {
    id: 'completo-lanzamiento',
    label: 'Pago único — lanzamiento (497€)',
    importe: 497,
    tipo: 'completo',
    descripcion: 'Programa completo al precio de lanzamiento',
  },
  {
    id: 'completo-oficial',
    label: 'Pago único — oficial (597€)',
    importe: 597,
    tipo: 'completo',
    descripcion: 'Programa completo al precio oficial',
  },
  {
    id: 'cuota-lanzamiento',
    label: 'Una cuota — lanzamiento aplazado (275€)',
    importe: 275,
    tipo: 'fraccionado',
    descripcion: '1 de 2 cuotas (total 550€ con +10%)',
  },
  {
    id: 'cuota-oficial',
    label: 'Una cuota — oficial aplazado (325€)',
    importe: 325,
    tipo: 'fraccionado',
    descripcion: '1 de 2 cuotas (total 650€ con +10%)',
  },
];

export function getPresetById(id: string): PaymentPreset | undefined {
  return PAYMENT_PRESETS.find((p) => p.id === id);
}

export function formatMonthLabel(mes: string): string {
  const [year, month] = mes.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  const label = date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function leadCaptureMonth(createdAt: string): string {
  return createdAt.slice(0, 7);
}
