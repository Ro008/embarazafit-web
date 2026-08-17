import { getRequiredEnv } from './env';

interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

export interface SyncSubscriberOptions {
  email: string;
  name?: string;
  groupIds?: number[];
  status?: 'active' | 'inactive';
}

export type MailrelaySubscriber = {
  id: number;
  status?: string;
  email?: string;
};

function mailrelayApi() {
  return {
    apiUrl: getRequiredEnv('MAILRELAY_API_URL').replace(/\/$/, ''),
    apiKey: getRequiredEnv('MAILRELAY_API_KEY'),
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableMailrelayError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const msg = err.message.toLowerCase();
  return (
    msg.includes('under review') ||
    msg.includes('try again later') ||
    msg.includes('(429)') ||
    msg.includes('(422)')
  );
}

/** Crea o actualiza un suscriptor (no pisa grupos existentes). */
export async function syncMailrelaySubscriber(
  options: SyncSubscriberOptions,
): Promise<MailrelaySubscriber> {
  const { apiUrl, apiKey } = mailrelayApi();
  const payload: Record<string, unknown> = {
    email: options.email,
    status: options.status ?? 'inactive',
    restore_if_deleted: false,
    replace_groups: false,
    locale: 'es',
  };
  if (options.name) payload.name = options.name;
  if (options.groupIds && options.groupIds.length > 0) {
    payload.group_ids = options.groupIds;
  }

  const response = await fetch(`${apiUrl}/api/v1/subscribers/sync`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-AUTH-TOKEN': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(
      `Mailrelay subscriber sync error (${response.status}): ${text}`,
    );
  }

  let data: unknown;
  try {
    data = JSON.parse(text) as unknown;
  } catch {
    throw new Error('Mailrelay subscriber sync: respuesta no válida');
  }

  const subscriber = unwrapSubscriber(data);
  return subscriber;
}

function unwrapSubscriber(data: unknown): MailrelaySubscriber {
  if (!data || typeof data !== 'object') {
    throw new Error('Mailrelay subscriber sync: respuesta no válida');
  }
  const obj = data as Record<string, unknown>;
  const inner =
    obj.data && typeof obj.data === 'object'
      ? (obj.data as Record<string, unknown>)
      : obj;
  const id = Number(inner.id);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Mailrelay subscriber sync: falta el id del suscriptor');
  }
  return {
    id,
    status: typeof inner.status === 'string' ? inner.status : undefined,
    email: typeof inner.email === 'string' ? inner.email : undefined,
  };
}

/** Email de confirmación (doble opt-in). Solo para suscriptoras inactivas. */
export async function resendMailrelayConfirmation(id: number): Promise<void> {
  const { apiUrl, apiKey } = mailrelayApi();
  const response = await fetch(
    `${apiUrl}/api/v1/subscribers/${id}/resend_confirmation_email`,
    {
      method: 'POST',
      headers: { 'X-AUTH-TOKEN': apiKey },
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `Mailrelay confirmation email error (${response.status}): ${text}`,
    );
  }
}

async function sendMailrelayEmailOnce(options: SendEmailOptions): Promise<void> {
  const { apiUrl, apiKey } = mailrelayApi();
  const fromEmail = getRequiredEnv('MAILRELAY_FROM_EMAIL');
  const fromName = getRequiredEnv('MAILRELAY_FROM_NAME');

  const response = await fetch(`${apiUrl}/api/v1/send_emails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-AUTH-TOKEN': apiKey,
    },
    body: JSON.stringify({
      from: { email: fromEmail, name: fromName },
      to: [{ email: options.to, name: options.toName ?? options.to }],
      subject: options.subject,
      html_part: options.html,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Mailrelay error (${response.status}): ${text}`);
  }
}

/** Pausa entre envíos + reintentos (Mailrelay en revisión suele fallar en el 2.º email seguido). */
export async function sendMailrelayEmail(
  options: SendEmailOptions,
  { retries = 3, retryDelayMs = 2500 } = {},
): Promise<void> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await sendMailrelayEmailOnce(options);
      return;
    } catch (err) {
      lastError = err;
      const canRetry = attempt < retries && isRetryableMailrelayError(err);
      if (!canRetry) throw err;
      await sleep(retryDelayMs);
    }
  }

  throw lastError;
}

export const MAILRELAY_SEND_GAP_MS = 5000;

export async function mailrelayGap(): Promise<void> {
  await sleep(MAILRELAY_SEND_GAP_MS);
}
