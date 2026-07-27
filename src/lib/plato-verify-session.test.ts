import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handlePlatoVerifySession } from './plato-verify-session';

vi.mock('./env', () => ({
  getEnv: vi.fn((name: string) => {
    if (name === 'PLATO_STRIPE_AMOUNT_CENTS') return undefined;
    return undefined;
  }),
  getRequiredEnv: vi.fn((name: string) => {
    if (name === 'STRIPE_SECRET_KEY') return 'sk_test_fake';
    throw new Error(`Missing ${name}`);
  }),
}));

describe('handlePlatoVerifySession', () => {
  const retrieve = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('responde 400 si falta sessionId', async () => {
    const result = await handlePlatoVerifySession({}, { retrieve });
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(retrieve).not.toHaveBeenCalled();
  });

  it('responde 400 si el sessionId no tiene formato de Stripe', async () => {
    const result = await handlePlatoVerifySession(
      { sessionId: 'premium=true' },
      { retrieve },
    );
    expect(result.status).toBe(400);
    expect(retrieve).not.toHaveBeenCalled();
  });

  it('responde 404 si Stripe no encuentra la sesión', async () => {
    retrieve.mockRejectedValue(new Error('No such checkout.session: cs_x'));

    const result = await handlePlatoVerifySession(
      { sessionId: 'cs_test_missing' },
      { retrieve },
    );

    expect(result.status).toBe(404);
    expect(String(result.body.error)).toMatch(/No encontramos/i);
  });

  it('responde 402 si el pago no está confirmado', async () => {
    retrieve.mockResolvedValue({
      id: 'cs_test_unpaid',
      payment_status: 'unpaid',
      amount_total: 600,
      currency: 'eur',
    });

    const result = await handlePlatoVerifySession(
      { sessionId: 'cs_test_unpaid' },
      { retrieve },
    );

    expect(result.status).toBe(402);
    expect(result.body.ok).toBe(false);
  });

  it('responde 403 si el importe no es el del Plato', async () => {
    retrieve.mockResolvedValue({
      id: 'cs_test_other',
      payment_status: 'paid',
      amount_total: 9900,
      currency: 'eur',
    });

    const result = await handlePlatoVerifySession(
      { sessionId: 'cs_test_other' },
      { retrieve },
    );

    expect(result.status).toBe(403);
    expect(String(result.body.error)).toMatch(/Plato Interactivo/i);
  });

  it('responde 200 si la sesión está pagada con el importe correcto', async () => {
    retrieve.mockResolvedValue({
      id: 'cs_test_ok',
      payment_status: 'paid',
      amount_total: 600,
      currency: 'eur',
    });

    const result = await handlePlatoVerifySession(
      { sessionId: '  cs_test_ok  ' },
      { retrieve },
    );

    expect(retrieve).toHaveBeenCalledWith('cs_test_ok');
    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      ok: true,
      method: 'stripe_session',
      sessionId: 'cs_test_ok',
    });
  });

  it('no otorga acceso a un sessionId inventado (Stripe falla)', async () => {
    retrieve.mockRejectedValue(new Error('No such checkout.session'));

    const result = await handlePlatoVerifySession(
      { sessionId: 'cs_live_inventado123' },
      { retrieve },
    );

    expect(result.status).toBe(404);
    expect(result.body.ok).toBe(false);
  });
});
