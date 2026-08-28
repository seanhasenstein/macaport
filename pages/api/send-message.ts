import { NextApiRequest, NextApiResponse } from 'next';
import { Db } from 'mongodb';
import { format, utcToZonedTime } from 'date-fns-tz';
import { connectToDb, contactMessage } from '../../db';
import { createContactReference } from '../../utils';
import { sendEmail } from '../../utils/mailgun';
import {
  contactSubject,
  customerSubject,
  generateContactFormEmail,
  generateCustomerConfirmationEmail,
} from '../../utils/email';
import { normalizeSubmission, validationSchema } from '../../utils/contact';
import { rateLimit } from '../../utils/rateLimit';
import { requestMeta } from '../../utils/requestMeta';
import { ContactFormValues, ContactRequestMeta } from 'interfaces';

interface ExtendedRequest extends NextApiRequest {
  body: ContactFormValues;
}

// Headroom for shared addresses. A school, an office, or anyone on mobile data
// can share one public IP, so a booster club filling this in from a meeting
// could look like one person submitting repeatedly. Ten still cuts a bot's
// throughput by orders of magnitude, and the cost of turning away a real lead
// is much higher here than the cost of letting a few more spam messages land.
const LIMIT = 10;
const WINDOW_MS = 10 * 60 * 1000;

// Email is otherwise the only place a contact enquiry exists. Mailgun accepting
// a message is not the same as anyone receiving it: a bounce, a filter, or a
// spam folder all leave the customer looking at a success screen, holding a
// reference number that refers to nothing, while nobody at Macaport knows a
// lead arrived. This is the copy that survives that.
//
// Fail-open, for the same reason utils/internalRequest is: a database that is
// down, paused, or misconfigured must not cost the lead this exists to protect.
// A record that cannot be written is logged and the emails go out regardless.
async function recordSubmission(
  values: ContactFormValues,
  referenceId: string,
  meta: ContactRequestMeta
) {
  try {
    const db = await connectToDb();
    await contactMessage.createContactMessage(
      db,
      values,
      referenceId,
      new Date(),
      meta
    );

    return db;
  } catch (err) {
    console.error(`Contact message #${referenceId} was not recorded`, err);
    return null;
  }
}

// A null db means the record was never written, so there is nothing to mark.
// Failing here is worth a log and nothing more — the enquiry is already stored,
// and an unmarked delivery is a worse record, not a lost one.
async function noteDelivered(
  db: Db | null,
  referenceId: string,
  part: 'notification' | 'confirmation'
) {
  if (!db) return;

  try {
    await contactMessage.markDelivered(db, referenceId, part);
  } catch (err) {
    console.error(
      `Contact message #${referenceId} sent but not marked ${part}`,
      err
    );
  }
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

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Read once and passed down, so the address the rate limit is keyed on and
  // the address written to the record are the same answer rather than two
  // calls that could drift.
  const meta = requestMeta(req);

  // The form checks this before it submits, but that only stops a bot driving
  // the page. Anything posting straight at this endpoint skipped that check
  // entirely, which made the honeypot decorative. Answers 200 rather than an
  // error so a bot learns nothing from the response.
  if (req.body?.honeypot) {
    // Logged, because silently absorbing these means nobody knows whether the
    // form takes one of these a month or a thousand — and that number is what
    // decides whether anything more than a honeypot is warranted. The trap
    // value itself is deliberately not logged: it is attacker-written text.
    console.warn(
      `Contact form honeypot tripped from ${meta.ip} (${meta.userAgent || 'no user agent'})`
    );
    return res.status(200).json({ success: true });
  }

  // This endpoint sends one email to Macaport and a second to whatever address
  // the caller supplies, so without a ceiling it will relay attacker-written
  // text from a domain Macaport has spent its sending reputation on.
  const limit = rateLimit({
    key: meta.ip,
    limit: LIMIT,
    windowMs: WINDOW_MS,
  });

  if (!limit.allowed) {
    res.setHeader('Retry-After', String(limit.retryAfterSeconds));
    return res.status(429).json({ error: 'Too many messages. Try again later.' });
  }

  // The same schema the form validates against, so the two cannot drift. Until
  // now the body was trusted exactly as posted: a wrong type threw somewhere
  // deep in the templates and surfaced as a 500, and anything well-formed
  // enough to render got delivered.
  try {
    await validationSchema.validate(req.body, { abortEarly: false });
  } catch (err) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  // Everything below reads from this rather than req.body, so the record and
  // both emails carry the same answers. Normalising after validation and not
  // before is deliberate: the schema should judge what was actually sent, and
  // an address that is only valid once it has been trimmed is not one this
  // endpoint should quietly accept.
  const values = normalizeSubmission(req.body);

  try {
    const id = createContactReference();
    const zonedDate = utcToZonedTime(new Date(), 'America/Chicago');
    // Long form to match the deadline dates in the emails, and because the
    // customer's confirmation quotes this inside a sentence.
    const timestamp = format(zonedDate, "MMMM d, yyyy 'at' h:mmaaa '(CT)'");

    // Kept before either email goes out, so the enquiry exists somewhere other
    // than inside a mail transaction that has already finished.
    const db = await recordSubmission(values, id, meta);

    const { text, html } = generateContactFormEmail(values, id, timestamp);

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
      subject: contactSubject(values, id),
      replyTo: values.email,
      text,
      html,
    });

    await noteDelivered(db, id, 'notification');

    // Confirmation to the customer. Sent after the notification and in its own
    // try/catch on purpose: the enquiry reaching Macaport is what matters, and
    // a bounced confirmation must not turn a received enquiry into an error
    // screen that makes someone submit all over again.
    try {
      const confirmation = generateCustomerConfirmationEmail(
        values,
        id,
        timestamp
      );

      await sendEmail({
        to: values.email,
        from: `Macaport <${process.env.CONTACT_FORM_FROM}>`,
        subject: customerSubject(values, id),
        // Replies go to Macaport, so a correction lands in this thread rather
        // than arriving as a second, competing enquiry.
        replyTo: Array.isArray(formattedToField)
          ? formattedToField[0]
          : formattedToField,
        text: confirmation.text,
        html: confirmation.html,
      });

      await noteDelivered(db, id, 'confirmation');
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
