import { beforeEach, describe, expect, it, vi } from 'vitest';
import { handleMenuRegalo } from './menu-regalo-api';

vi.mock('./env', () => ({
  getEnv: vi.fn(() => undefined),
}));

vi.mock('./mailrelay', () => ({
  syncMailrelaySubscriber: vi.fn(),
  resendMailrelayConfirmation: vi.fn(),
}));

import { getEnv } from './env';
import {
  resendMailrelayConfirmation,
  syncMailrelaySubscriber,
} from './mailrelay';

const getEnvMock = vi.mocked(getEnv);
const syncSubscriber = vi.mocked(syncMailrelaySubscriber);
const resendConfirmation = vi.mocked(resendMailrelayConfirmation);

describe('handleMenuRegalo', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getEnvMock.mockReturnValue(undefined);
    syncSubscriber.mockResolvedValue({ id: 10, status: 'inactive' });
    resendConfirmation.mockResolvedValue(undefined);
  });

  it('responde 400 si el email no es válido', async () => {
    const result = await handleMenuRegalo({ email: 'no-es-un-email' });
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(syncSubscriber).not.toHaveBeenCalled();
  });

  it('ignora el honeypot sin llamar a Mailrelay', async () => {
    const result = await handleMenuRegalo({
      email: 'ana@example.com',
      hp_field: 'http://spam.test',
    });
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true });
    expect(syncSubscriber).not.toHaveBeenCalled();
  });

  it('crea la suscriptora inactiva y envía el email de confirmación', async () => {
    const result = await handleMenuRegalo({
      nombre: 'Ana Pérez',
      email: 'ana@example.com',
    });

    expect(syncSubscriber).toHaveBeenCalledWith({
      email: 'ana@example.com',
      name: 'Ana Pérez',
      groupIds: [1],
      status: 'inactive',
    });
    expect(resendConfirmation).toHaveBeenCalledWith(10);
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true, alreadyActive: false });
  });

  it('no reenvía confirmación si ya está activa', async () => {
    syncSubscriber.mockResolvedValue({ id: 10, status: 'active' });

    const result = await handleMenuRegalo({ email: 'ana@example.com' });

    expect(resendConfirmation).not.toHaveBeenCalled();
    expect(result.status).toBe(200);
    expect(result.body).toEqual({ ok: true, alreadyActive: true });
  });

  it('responde 500 si Mailrelay falla', async () => {
    syncSubscriber.mockRejectedValue(new Error('sync down'));

    const result = await handleMenuRegalo({ email: 'ana@example.com' });

    expect(result.status).toBe(500);
    expect(result.body.ok).toBe(false);
  });
});
