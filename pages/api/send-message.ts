import { NextApiRequest, NextApiResponse } from 'next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { createReceiptNumber } from '../../utils';
import { sendEmail } from '../../utils/mailgun';
import { generateContactFormEmail } from '../../utils/email';
import { ContactFormValues } from 'interfaces';

interface ExtendedRequest extends NextApiRequest {
  body: ContactFormValues;
}

export default async function handler(
  req: ExtendedRequest,
  res: NextApiResponse
) {
  if (!process.env.CONTACT_FORM_TO) {
    throw new Error('CONTACT_FORM_TO env. var is required');
  }

  if (!process.env.CONTACT_FORM_FROM) {
    throw new Error('CONTACT_FORM_FROM env. var is required');
  }

  try {
    const id = createReceiptNumber();
    const zonedDate = utcToZonedTime(new Date(), 'America/Chicago');
    const timestamp = format(zonedDate, "MM/dd/yyyy 'at' h:mmaaa '(CT)'");

    const { text, html } = generateContactFormEmail(req.body, id, timestamp);

    const toField = process.env.CONTACT_FORM_TO;
    let formattedToField;

    if (toField.includes(',')) {
      formattedToField = toField.split(',').map(email => email.trim());
    } else {
      formattedToField = toField;
    }

    const result = await sendEmail({
      to: formattedToField,
      from: `Macaport Contact Form <${process.env.CONTACT_FORM_FROM}>`,
      subject: `Contact Form Message [#${id}]`,
      replyTo: req.body.email,
      text,
      html,
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
