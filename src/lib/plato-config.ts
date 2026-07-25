export const PLATO_PREMIUM_COOKIE = 'embarazafit_plato_premium';
export const PLATO_PREMIUM_PARAM = 'premium';
/** Param del magic link enviado por email: /plato?acceso=TOKEN */
export const PLATO_ACCESS_PARAM = 'acceso';
export const PLATO_PREMIUM_PRICE = '6€';
export const PLATO_PREMIUM_AMOUNT = '6';
export const PLATO_PREMIUM_CURRENCY = '€';
/** Importe en céntimos (Stripe). Usado para filtrar el webhook. */
export const PLATO_PRICE_CENTS = 600;
export const PLATO_CHECKOUT_URL =
  'https://buy.stripe.com/9B63coc3XeCn0r60c42sM00';
export const PLATO_SITE_ORIGIN = 'https://www.embarazafit.com';

export function platoAccessUrl(token: string): string {
  return `${PLATO_SITE_ORIGIN}/plato?${PLATO_ACCESS_PARAM}=${encodeURIComponent(token)}`;
}
