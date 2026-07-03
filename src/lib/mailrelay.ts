import { getRequiredEnv } from './env';

interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
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

async function sendMailrelayEmailOnce(options: SendEmailOptions): Promise<void> {
  const apiUrl = getRequiredEnv('MAILRELAY_API_URL').replace(/\/$/, '');
  const apiKey = getRequiredEnv('MAILRELAY_API_KEY');
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
