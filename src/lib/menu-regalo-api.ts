import { getEnv } from './env';
import {
  resendMailrelayConfirmation,
  syncMailrelaySubscriber,
} from './mailrelay';
import {
  newsletterGroupIds,
  validateMenuPayload,
  type MenuPayload,
} from './menu-form';

export type MenuRegaloResult = {
  status: number;
  body: Record<string, unknown>;
};

/**
 * Alta en la newsletter con doble opt-in de Mailrelay.
 * El menú lo envía la automatización cuando confirman el email.
 */
export async function handleMenuRegalo(
  body: MenuPayload,
): Promise<MenuRegaloResult> {
  if (typeof body.hp_field === 'string' && body.hp_field.trim() !== '') {
    return { status: 200, body: { ok: true } };
  }

  const validated = validateMenuPayload(body);
  if ('error' in validated) {
    return { status: 400, body: { ok: false, error: validated.error } };
  }

  try {
    const subscriber = await syncMailrelaySubscriber({
      email: validated.email,
      name: validated.nombre,
      groupIds: newsletterGroupIds(getEnv('MAILRELAY_NEWSLETTER_GROUP_IDS')),
      status: 'inactive',
    });

    const status = (subscriber.status ?? '').toLowerCase();
    if (status === 'disabled') {
      return {
        status: 400,
        body: {
          ok: false,
          error:
            'Este email está dado de baja. Si quieres volver a suscribirte, escríbeme a contacto@embarazafit.com.',
        },
      };
    }

    if (status !== 'active') {
      await resendMailrelayConfirmation(subscriber.id);
    }

    return { status: 200, body: { ok: true, alreadyActive: status === 'active' } };
  } catch (err) {
    console.error('menu-regalo error:', err);
    return {
      status: 500,
      body: {
        ok: false,
        error: 'No se pudo enviar la confirmación. Inténtalo de nuevo más tarde.',
      },
    };
  }
}
