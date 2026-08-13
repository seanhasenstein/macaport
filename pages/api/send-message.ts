import { NextApiRequest, NextApiResponse } from 'next';
import { format, utcToZonedTime } from 'date-fns-tz';
import { createContactReference } from '../../utils';
import { sendEmail } from '../../utils/mailgun';
import {
  contactSubject,
  generateContactFormEmail,
  generateCustomerConfirmationEmail,
} from '../../utils/email';
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

  // The form checks this before it submits, but that only stops a bot driving
  // the page. Anything posting straight at this endpoint skipped that check
  // entirely, which made the honeypot decorative. Answers 200 rather than an
  // error so a bot learns nothing from the response.
  if (req.body?.honeypot) {
    return res.status(200).json({ success: true });
  }

  try {
    const id = createContactReference();
    const zonedDate = utcToZonedTime(new Date(), 'America/Chicago');
    // Long form to match the deadline dates in the emails, and because the
    // customer's confirmation quotes this inside a sentence.
    const timestamp = format(zonedDate, "MMMM d, yyyy 'at' h:mmaaa '(CT)'");

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
      // Says what it is and who from, so it can be triaged from the inbox list
      // without opening it.
      subject: contactSubject(req.body, id),
      replyTo: req.body.email,
      text,
      html,
    });

    // Confirmation to the customer. Sent after the notification and in its own
    // try/catch on purpose: the enquiry reaching Macaport is what matters, and
    // a bounced confirmation must not turn a received enquiry into an error
    // screen that makes someone submit all over again.
    try {
      const confirmation = generateCustomerConfirmationEmail(
        req.body,
        id,
        timestamp
      );

      await sendEmail({
        to: req.body.email,
        from: `Macaport <${process.env.CONTACT_FORM_FROM}>`,
        subject: `We got your message [#${id}]`,
        // Replies go to Macaport, so a correction lands in this thread rather
        // than arriving as a second, competing enquiry.
        replyTo: Array.isArray(formattedToField)
          ? formattedToField[0]
          : formattedToField,
        text: confirmation.text,
        html: confirmation.html,
      });
    } catch (confirmationError) {
      console.error('Customer confirmation failed to send', confirmationError);
    }

    // Named separately from anything Mailgun returns: its own response carries
    // an `id` of its own, and the success screen needs the reference the
    // customer sees in their confirmation email, not the message id.
    res.status(200).json({ ...result, referenceId: id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
