import fetch from 'node-fetch';
import FormData from 'form-data';

type SendEmailParams = {
  to: string | string[];
  from: string;
  subject: string;
  text: string;
  html?: string;
  bcc?: string;
  replyTo?: string;
};

// Only production may email a real customer. Anywhere else, a recipient on
// EMAIL_ALLOWLIST (exact addresses or @domains, comma separated) is
// delivered to, so Macaport staff can test with their own inboxes, and
// everyone else is redirected to EMAIL_REDIRECT_TO with the intended
// recipient in the subject. With neither set, sending refuses rather than
// guessing. The dev database is a copy of production, so the data alone is
// never a safe signal. Mirrors the dashboard's guard exactly; keep them in
// step.
export function isProduction() {
  return process.env.VERCEL_ENV === 'production';
}

export function isAllowlisted(
  to: string,
  allowlist = process.env.EMAIL_ALLOWLIST
) {
  const email = to.trim().toLowerCase();
  const domain = email.slice(email.lastIndexOf('@'));
  return (allowlist ?? '')
    .split(',')
    .map(entry => entry.trim().toLowerCase())
    .filter(Boolean)
    .some(entry =>
      entry.startsWith('@') ? entry === domain : entry === email
    );
}

export function resolveRecipient(to: string) {
  if (isProduction()) return { to, redirected: false };
  if (isAllowlisted(to)) return { to, redirected: false };
  const redirect = process.env.EMAIL_REDIRECT_TO;
  // Mail for the test inbox itself is not a redirect, or the subject would
  // say "[TEST → x] " and the page "sent to x instead of x".
  if (redirect && redirect.trim().toLowerCase() === to.trim().toLowerCase()) {
    return { to, redirected: false };
  }
  if (!redirect) {
    throw new Error(
      'Refusing to send email outside production: set EMAIL_REDIRECT_TO to a test inbox, or add the recipient to EMAIL_ALLOWLIST.'
    );
  }
  return { to: redirect, redirected: true };
}

// The same answer without the throw, for pages that only need to tell a
// tester where a message went (or would have gone).
export function describeDelivery(to: string) {
  try {
    const recipient = resolveRecipient(to);
    return { deliveredTo: recipient.to, redirected: recipient.redirected };
  } catch {
    return { deliveredTo: null, redirected: true };
  }
}

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
  bcc,
  replyTo,
}: SendEmailParams) {
  const intended = typeof to === 'string' ? [to] : to;
  const resolved = intended.map(resolveRecipient);
  const redirected = resolved.some(r => r.redirected);
  // Redirected recipients collapse onto the one test inbox.
  const deliverTo = Array.from(new Set(resolved.map(r => r.to)));
  // A bcc is a recipient too, and the same rule applies. Dropped if it
  // resolves to an address already receiving the message.
  const resolvedBcc = bcc ? resolveRecipient(bcc) : undefined;
  const deliverBcc =
    resolvedBcc && !deliverTo.includes(resolvedBcc.to)
      ? resolvedBcc.to
      : undefined;

  const form = new FormData();
  const endpoint = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`;

  for (const email of deliverTo) {
    form.append('to', email);
  }

  form.append('from', from);
  form.append(
    'subject',
    redirected ? `[TEST → ${intended.join(', ')}] ${subject}` : subject
  );
  form.append('text', text);

  if (html) form.append('html', html);
  if (deliverBcc) form.append('bcc', deliverBcc);
  if (replyTo) form.append('h:Reply-To', replyTo);

  const res = await fetch(endpoint, {
    method: 'POST',
    body: form,
    headers: {
      Authorization: `Basic ${Buffer.from(
        `api:${process.env.MAILGUN_API_KEY}`
      ).toString('base64')}`,
    },
  });

  if (!res.ok) {
    throw new Error('An error occurred with the MailGun API.');
  }

  // Callers surface a redirect in the UI so a tester sees where the message
  // went instead of wondering why the customer never got it.
  return {
    success: true,
    deliveredTo: deliverTo.length === 1 ? deliverTo[0] : deliverTo,
    redirected,
  };
}
