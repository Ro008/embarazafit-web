export interface PlatoCompra {
  id: string;
  stripe_session_id: string;
  email: string | null;
  customer_name: string | null;
  importe: number;
  currency: string;
  created_at: string;
}

/** Mes YYYY-MM a partir de la fecha de compra (UTC). */
export function platoCompraMonth(iso: string): string {
  return iso.slice(0, 7);
}
