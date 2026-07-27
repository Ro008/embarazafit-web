import { describe, expect, it } from 'vitest';
import {
  generatePlatoAccessToken,
  normalizePlatoEmail,
} from './plato-compras';
import {
  PLATO_ACCESS_PARAM,
  PLATO_SESSION_PARAM,
  PLATO_STRIPE_SUCCESS_URL,
  platoAccessUrl,
} from './plato-config';

describe('normalizePlatoEmail', () => {
  it('recorta y pasa a minúsculas', () => {
    expect(normalizePlatoEmail('  Ana@Example.COM ')).toBe('ana@example.com');
  });
});

describe('generatePlatoAccessToken', () => {
  it('genera tokens opacos distintos', () => {
    const a = generatePlatoAccessToken();
    const b = generatePlatoAccessToken();
    expect(a).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(a.length).toBeGreaterThanOrEqual(32);
    expect(a).not.toBe(b);
  });
});

describe('platoAccessUrl', () => {
  it('construye el magic link con el param acceso', () => {
    const url = platoAccessUrl('tok_abc');
    expect(url).toBe(
      `https://www.embarazafit.com/plato?${PLATO_ACCESS_PARAM}=tok_abc`,
    );
  });
});

describe('PLATO_STRIPE_SUCCESS_URL', () => {
  it('usa session_id y el placeholder de Stripe', () => {
    expect(PLATO_STRIPE_SUCCESS_URL).toBe(
      `https://www.embarazafit.com/plato?${PLATO_SESSION_PARAM}={CHECKOUT_SESSION_ID}`,
    );
    expect(PLATO_STRIPE_SUCCESS_URL).not.toContain('premium=true');
  });
});
