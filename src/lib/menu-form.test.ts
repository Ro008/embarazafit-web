import { describe, expect, it } from 'vitest';
import {
  DEFAULT_MAILRELAY_NEWSLETTER_GROUP_ID,
  newsletterGroupIds,
  parseMailrelayGroupIds,
  validateMenuPayload,
} from './menu-form';

describe('validateMenuPayload', () => {
  it('exige un email', () => {
    expect(validateMenuPayload({})).toEqual({ error: 'Indica un email válido.' });
    expect(validateMenuPayload({ email: '   ' })).toEqual({
      error: 'Indica un email válido.',
    });
  });

  it('rechaza un email mal formado', () => {
    expect(validateMenuPayload({ email: 'no-es-un-email' })).toEqual({
      error: 'Indica un email válido.',
    });
  });

  it('acepta plus-addressing (gmail +test)', () => {
    const result = validateMenuPayload({
      nombre: 'Rocío',
      email: 'rociosirvent+test@gmail.com',
    });
    expect(result).toEqual({
      nombre: 'Rocío',
      email: 'rociosirvent+test@gmail.com',
    });
  });

  it('el nombre es opcional y se recorta', () => {
    expect(validateMenuPayload({ email: 'ana@example.com' })).toEqual({
      email: 'ana@example.com',
    });
    expect(
      validateMenuPayload({ nombre: '  Ana  ', email: 'ana@example.com' }),
    ).toEqual({ nombre: 'Ana', email: 'ana@example.com' });
  });

  it('rechaza un nombre de una sola letra si se envía', () => {
    expect(
      validateMenuPayload({ nombre: 'R', email: 'ana@example.com' }),
    ).toEqual({ error: 'Indica tu nombre.' });
  });
});

describe('parseMailrelayGroupIds', () => {
  it('devuelve vacío si no hay valor', () => {
    expect(parseMailrelayGroupIds(undefined)).toEqual([]);
    expect(parseMailrelayGroupIds('')).toEqual([]);
  });

  it('parsea IDs separados por coma', () => {
    expect(parseMailrelayGroupIds('1, 4, 5')).toEqual([1, 4, 5]);
  });

  it('newsletterGroupIds usa el grupo Default si no hay env', () => {
    expect(newsletterGroupIds(undefined)).toEqual([
      DEFAULT_MAILRELAY_NEWSLETTER_GROUP_ID,
    ]);
    expect(newsletterGroupIds('2')).toEqual([2]);
  });
});
