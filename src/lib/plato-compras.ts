import { randomBytes } from 'node:crypto';

export interface PlatoCompra {
  id: string;
  stripe_session_id: string;
  email: string | null;
  customer_name: string | null;
  importe: number;
  currency: string;
  access_token: string | null;
  access_email_sent_at: string | null;
  created_at: string;
}

/** Mes YYYY-MM a partir de la fecha de compra (UTC). */
export function platoCompraMonth(iso: string): string {
  return iso.slice(0, 7);
}

export function normalizePlatoEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Token opaco para magic link (sin caducidad). */
export function generatePlatoAccessToken(): string {
  return randomBytes(32).toString('base64url');
}
