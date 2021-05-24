import { NextApiRequest, NextApiResponse } from 'next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { createId } from '../../utils';
import { sendEmail } from '../../utils/mailgun';
import { generateContactFormEmail } from '../../utils/email';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const id = createId(false, 8);
    const date = new Date();
    const timeZone = 'America/Chicago';
    const zonedDate = utcToZonedTime(date, timeZone);
    const timestamp = format(zonedDate, "MM/dd/yyyy 'at' h:mmaaa '(CT)'");

    const { text, html } = generateContactFormEmail(req.body, id, timestamp);

    const result = await sendEmail({
      to: `<${process.env.CONTACT_FORM_TO}>`,
      from: `Macaport Contact Form <${process.env.CONTACT_FORM_FROM}>`,
      subject: `Contact Form Message [#${id}]`,
      replyTo: req.body.email,
      text,
      html,
    });

    console.log(result);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
