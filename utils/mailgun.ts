import fetch from 'node-fetch';
import FormData from 'form-data';

type SendEmailParams = {
  to: string;
  from: string;
  subject: string;
  text: string;
  html?: string;
  bcc?: string;
  replyTo?: string;
};

const AUTHTOKEN = `Basic ${Buffer.from(
  `api:${process.env.MAILGUN_API_KEY}`
).toString(`base64`)}`;

export async function sendEmail({
  to,
  from,
  subject,
  text,
  html,
  bcc,
  replyTo,
}: SendEmailParams) {
  try {
    const form = new FormData();
    const endpoint = `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`;

    form.append('to', to);
    form.append('from', from);
    form.append('subject', subject);
    form.append('text', text);

    if (html) form.append('html', html);
    if (bcc) form.append('bcc', bcc);
    if (replyTo) form.append('replyTo', replyTo);

    const res = await fetch(endpoint, {
      method: 'post',
      body: form,
      headers: {
        Authorization: AUTHTOKEN,
      },
    });

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
