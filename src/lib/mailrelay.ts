import { getRequiredEnv } from './env';

interface SendEmailOptions {
  to: string;
  toName?: string;
  subject: string;
  html: string;
}

export async function sendMailrelayEmail(
  options: SendEmailOptions,
): Promise<void> {
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
