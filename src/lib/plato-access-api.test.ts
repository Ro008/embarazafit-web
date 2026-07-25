import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  handlePlatoAccess,
  mockPlatoCompra,
} from './plato-access-api';

vi.mock('./supabase', () => ({
  findPlatoCompraByToken: vi.fn(),
  findPlatoCompraByEmail: vi.fn(),
  ensurePlatoAccessToken: vi.fn(),
  markPlatoAccessEmailSent: vi.fn(),
}));

vi.mock('./mailrelay', () => ({
  sendMailrelayEmail: vi.fn(),
}));

import {
  ensurePlatoAccessToken,
  findPlatoCompraByEmail,
  findPlatoCompraByToken,
  markPlatoAccessEmailSent,
} from './supabase';
import { sendMailrelayEmail } from './mailrelay';

const findByToken = vi.mocked(findPlatoCompraByToken);
const findByEmail = vi.mocked(findPlatoCompraByEmail);
const ensureToken = vi.mocked(ensurePlatoAccessToken);
const markSent = vi.mocked(markPlatoAccessEmailSent);
const sendMail = vi.mocked(sendMailrelayEmail);

describe('handlePlatoAccess', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('responde 400 si no hay token ni email', async () => {
    const result = await handlePlatoAccess({});
    expect(result.status).toBe(400);
    expect(result.body.ok).toBe(false);
    expect(result.body.error).toMatch(/email o un token/i);
  });

  it('responde 400 si el JSON tiene email inválido', async () => {
    const result = await handlePlatoAccess({ email: 'no-es-un-email' });
    expect(result.status).toBe(400);
    expect(result.body.error).toMatch(/email válido/i);
  });

  describe('por token (magic link)', () => {
    it('responde 404 con mensaje claro si el token no existe', async () => {
      findByToken.mockResolvedValue(null);

      const result = await handlePlatoAccess({ token: 'tok_inventado' });

      expect(findByToken).toHaveBeenCalledWith('tok_inventado');
      expect(result.status).toBe(404);
      expect(result.body.ok).toBe(false);
      expect(String(result.body.error)).toMatch(/enlace de acceso no es válido/i);
    });

    it('responde 200 si el token es válido', async () => {
      findByToken.mockResolvedValue(mockPlatoCompra());

      const result = await handlePlatoAccess({ token: '  tok_test_abc  ' });

      expect(findByToken).toHaveBeenCalledWith('tok_test_abc');
      expect(result.status).toBe(200);
      expect(result.body).toEqual({ ok: true, method: 'token' });
      expect(sendMail).not.toHaveBeenCalled();
    });

    it('responde 500 si la base de datos falla', async () => {
      findByToken.mockRejectedValue(new Error('db down'));

      const result = await handlePlatoAccess({ token: 'tok_x' });

      expect(result.status).toBe(500);
      expect(result.body.ok).toBe(false);
    });
  });

  describe('por email (Ya compré)', () => {
    it('responde 404 con mensaje claro si no hay compra', async () => {
      findByEmail.mockResolvedValue(null);

      const result = await handlePlatoAccess({
        email: 'nadie@example.com',
      });

      expect(findByEmail).toHaveBeenCalledWith('nadie@example.com');
      expect(result.status).toBe(404);
      expect(String(result.body.error)).toMatch(
        /No encontramos una compra con ese email/i,
      );
      expect(sendMail).not.toHaveBeenCalled();
    });

    it('desbloquea, reenvía email y marca envío si la compra existe', async () => {
      const compra = mockPlatoCompra();
      findByEmail.mockResolvedValue(compra);
      ensureToken.mockResolvedValue(compra);
      sendMail.mockResolvedValue(undefined);
      markSent.mockResolvedValue(undefined);

      const result = await handlePlatoAccess({
        email: 'clienta@example.com',
      });

      expect(ensureToken).toHaveBeenCalledWith(compra);
      expect(sendMail).toHaveBeenCalledOnce();
      expect(sendMail.mock.calls[0][0]).toMatchObject({
        to: 'clienta@example.com',
        subject: expect.stringContaining('Plato Interactivo'),
      });
      expect(String(sendMail.mock.calls[0][0].html)).toContain('tok_test_abc');
      expect(markSent).toHaveBeenCalledWith('compra-1');
      expect(result.status).toBe(200);
      expect(result.body).toEqual({
        ok: true,
        method: 'email',
        emailResent: true,
      });
    });

    it('desbloquea igual si Mailrelay falla', async () => {
      const compra = mockPlatoCompra();
      findByEmail.mockResolvedValue(compra);
      ensureToken.mockResolvedValue(compra);
      sendMail.mockRejectedValue(new Error('mailrelay 429'));

      const result = await handlePlatoAccess({
        email: 'clienta@example.com',
      });

      expect(result.status).toBe(200);
      expect(result.body.ok).toBe(true);
      expect(markSent).not.toHaveBeenCalled();
    });

    it('genera token si la compra no tenía', async () => {
      const sinToken = mockPlatoCompra({ access_token: null });
      const conToken = mockPlatoCompra({ access_token: 'tok_nuevo' });
      findByEmail.mockResolvedValue(sinToken);
      ensureToken.mockResolvedValue(conToken);
      sendMail.mockResolvedValue(undefined);

      const result = await handlePlatoAccess({
        email: 'clienta@example.com',
      });

      expect(ensureToken).toHaveBeenCalledWith(sinToken);
      expect(String(sendMail.mock.calls[0][0].html)).toContain('tok_nuevo');
      expect(result.status).toBe(200);
    });
  });
});
