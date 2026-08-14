import {
  formatDateValue,
  formatPhoneNumber,
  formatToMoney,
} from './index';
import {
  confirmationNote,
  nextStep,
  FABRIC_OPTIONS,
  SHIPPING_OPTIONS,
  inquiryLabel,
  joinLabels,
  productLabel,
  OTHER_PRODUCT_ID,
} from './contact';
import { Order } from '../interfaces';

const FONT = `-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif`;

// Email clients render borders more faintly than a browser does, and several
// strip background colours entirely — which leaves the border as the only thing
// holding a box together. These sit a step darker than the equivalents in
// styles/theme.ts for that reason.
const BORDER = '#d4d4d4'; // card and callout outlines
const BORDER_SOFT = '#e5e5e5'; // dividers between rows
const BORDER_BRAND = '#b5d5c2'; // the green disclaimer callout
const PAGE_BG = '#f0f0f0'; // the ground both contact emails sit on

// One source for the postal address. It appears in the confirmation footer,
// where it does double duty: a real address is one of the signals that keeps
// mail out of spam folders, and this is a place customers actually collect
// orders from.
export const MACAPORT_ADDRESS = 'Macaport LLC, 3080 Frederick Farm Ln. Suite 101, New London, WI 54961';

// Everything interpolated below is typed by a stranger. Without this a stray
// angle bracket in a message breaks the layout, and a deliberate one puts
// arbitrary markup in Macaport's inbox.
function escapeHtml(value: string) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Message bodies arrive with real line breaks in them. Escaped first, so this
// is the only markup that survives from user input.
function escapeMultiline(value: string) {
  return escapeHtml(value).replace(/\r?\n/g, '<br />');
}

// Label above value rather than beside it: these values run long (a products
// line with quantities, a pasted message) and a two-column layout collapses
// unpredictably on a phone. The value is inserted as-is, so callers escape it —
// the message row needs its line breaks turned into markup after escaping.
function summaryRowHtml(label: string, value: string, last = false) {
  return `<tr><td style="padding:14px 0;${
    last ? '' : `border-bottom:1px solid ${BORDER_SOFT};`
  }"><div style="margin:0 0 3px;color:#737373;font-family:${FONT};font-size:12px;line-height:1.4;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;">${escapeHtml(
    label
  )}</div><div style="margin:0;color:#171717;font-family:${FONT};font-size:15px;line-height:1.55;">${value}</div></td></tr>`;
}

// Shared between the two emails so their headers line up: both open with a
// title block, state the reference and when it arrived, then rule off before
// the detail starts.
// The kicker above the title. Uppercase micro-type, and the only thing in the
// email set that way apart from the row labels — which is why section headings
// below are deliberately not.
const eyebrow = (text: string, top: number) =>
  `<p style="margin:${top}px 0 0;color:#a1a1a1;font-family:${FONT};font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;">${text}</p>`;

// Sentence case, dark, and a size up. An uppercase grey section heading sat
// directly above an uppercase grey row label, and two near-identical labels in
// a row read as one element repeated rather than as a heading and its content.
// Differing by case, colour, weight and size at once makes the levels obvious.
const sectionHeading = (text: string, top: number) =>
  `<p style="margin:${top}px 0 2px;color:#171717;font-family:${FONT};font-size:14px;font-weight:600;line-height:1.4;">${text}</p>`;

const table = (rows: string) =>
  `<table role="presentation" width="100%" border="0" cellpadding="0" cellspacing="0" style="border-collapse:collapse;"><tbody>${rows}</tbody></table>`;

// The same green pill the success screen shows the moment they hit send, so
// the email reads as a continuation of that rather than an unrelated message.
// Text only. The success screen pairs this with a check icon, but that is an
// inline SVG in a font stack we control; in email, images are blocked by
// default and a check character is at the mercy of whatever symbol font the
// client falls back to. The colour and the wording already do the work.
const badge = (text: string) =>
  `<p style="margin:0 0 14px;"><span style="display:inline-block;padding:6px 12px;font-family:${FONT};font-size:12px;font-weight:600;line-height:1.3;color:#0d6b2b;background-color:#f1f7f3;border:1px solid ${BORDER_BRAND};border-radius:999px;">${text}</span></p>`;

const metaLine = (id: string, date: string) =>
  `<p style="margin:12px 0 0;color:#737373;font-family:${FONT};font-size:13px;line-height:1.5;">Reference #${escapeHtml(
    id
  )} &nbsp;&middot;&nbsp; ${escapeHtml(date)}</p>`;

// A rule rather than a bordered box: a hairline is the one divider every mail
// client renders the same way.
const divider = (top: number) =>
  `<div style="margin:${top}px 0 0;height:1px;background-color:${BORDER};font-size:0;line-height:0;">&nbsp;</div>`;

interface Message {
  inquiryType?: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization?: string;
  products?: string[];
  quantities?: Record<string, string>;
  productOther?: string;
  orderNumber?: string;
  decoration?: string;
  fabric?: string[];
  colors?: string;
  artwork?: string;
  delivery?: string;
  shipping?: string[];
  neededBy?: string;
  groupSize?: string;
  openTiming?: string;
  storeDuration?: string;
  message: string;
}

interface EmailParams extends Message {
  id: string;
  date: string;
}

// What the enquiry is, written for whoever has to action it. Deliberately not
// the INQUIRY_OPTIONS labels, which are phrased as a customer answering "what
// is this about?" — "A new custom apparel order" set in bold at the top of an
// email reads for a moment like an order that was actually placed. These name
// the request instead, and are short enough to survive an inbox subject line.
const ADMIN_HEADINGS: Record<string, string> = {
  apparel: 'Apparel quote request',
  'team-store': 'Online store request',
  'gang-sheets': 'Gang sheet question',
  existing: 'Question about an existing order',
  'missed-deadline': 'Missed store deadline',
  other: 'General inquiry',
};

const adminHeading = (inquiryType?: string) =>
  ADMIN_HEADINGS[inquiryType ?? ''] ?? 'Contact form message';

// "Apparel quote request from Sean Hasenstein [#7R3VG9]" rather than the same
// six words on every message. The inbox list is the first place these get
// triaged, and it is the only place the subject does any work.
//
// The name is collapsed to one line first. A subject header cannot contain a
// line break, and this is the one place a stranger's typing reaches one — the
// old subject was a fixed string plus a generated id, so nothing user-supplied
// could get in. Long names are cut so the useful part survives the inbox
// column, which truncates around 70 characters anyway.
export function contactSubject(message: Message, id: string) {
  const raw = `${message.firstName ?? ''} ${message.lastName ?? ''}`;
  const name = String(raw).replace(/[\r\n]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 60);
  const heading = adminHeading(message.inquiryType);

  return `${heading}${name ? ` from ${name}` : ''} [#${id}]`;
}

// Written for the person who sent it, not for whoever has to action it, so
// these are not ADMIN_HEADINGS. Specific enough to find in a search weeks
// later, and to tell apart from a second enquiry about something else.
//
// missed-deadline is deliberately absent. "Missed store deadline" is a fair
// description for a work queue and an unkind thing to put in the inbox of
// someone already apologising for it, so that path keeps the neutral subject.
const CUSTOMER_SUBJECTS: Record<string, string> = {
  apparel: 'We got your apparel quote request',
  'team-store': 'We got your online store request',
  'gang-sheets': 'We got your gang sheet question',
  // Not "about your order". This path is for a question about an order or a
  // store, and the form only asks for a store name and an order number, both
  // optional — so someone chasing an order without the number to hand looks
  // exactly like someone asking about a store. Naming the wrong one reads as
  // not having understood them, which is worse than not naming it.
  existing: 'We got your question',
};

export function customerSubject(message: Message, id: string) {
  const subject = CUSTOMER_SUBJECTS[message.inquiryType ?? ''];

  return `${subject ?? 'We got your message'} [#${id}]`;
}

// One field, asked four different ways. Someone on the missed-deadline path
// answers "Which store did you miss?" and would otherwise get it back labelled
// "Organization", which reads like we filed their answer under the wrong
// question. Neutral enough to also make sense in the notification to Macaport.
const ORGANIZATION_LABELS: Record<string, string> = {
  apparel: 'Team or organization',
  'team-store': 'Organization or group',
  existing: 'Store name',
  'missed-deadline': 'Store missed',
};

// The contact form asks a different set of follow-up questions depending on
// what the lead is about, so the email only lists the ones that were answered.
// Anything blank is dropped rather than rendered as an empty row.
function inquiryDetails(input: EmailParams) {
  const rows: { label: string; value: string }[] = [
    {
      label: 'About',
      value: input.inquiryType ? inquiryLabel(input.inquiryType) : '',
    },
    {
      label:
        ORGANIZATION_LABELS[input.inquiryType ?? ''] ?? 'Organization',
      value: input.organization ?? '',
    },
    { label: 'Order number', value: input.orderNumber ?? '' },
    {
      label: 'Products',
      // "T-shirts (24), Hats (12)" — the quantity belongs beside the item it
      // counts, not in a separate total that has to be worked back out.
      value: (input.products ?? [])
        .map(id => {
          const quantity = input.quantities?.[id]?.trim();
          return quantity
            ? `${productLabel(id)} (${quantity})`
            : productLabel(id);
        })
        .join(', '),
    },
    {
      label: 'Also looking for',
      // Only when the checkbox that asks for it is still ticked. Unticking
      // "Something else" does not clear the text field, so this would otherwise
      // report an item the customer had already taken back off the list.
      value: (input.products ?? []).includes(OTHER_PRODUCT_ID)
        ? input.productOther ?? ''
        : '',
    },
    { label: 'Printed or embroidered', value: input.decoration ?? '' },
    { label: 'Artwork ready', value: input.artwork ?? '' },
    { label: 'Fabric', value: joinLabels(FABRIC_OPTIONS, input.fabric) },
    { label: 'Garment colors', value: input.colors ?? '' },
    { label: 'Needed by', value: formatDateValue(input.neededBy) },
    { label: 'Pickup or shipping', value: input.delivery ?? '' },
    {
      label: 'How people get their orders',
      value: joinLabels(SHIPPING_OPTIONS, input.shipping),
    },
    { label: 'Group size', value: input.groupSize ?? '' },
    { label: 'Store opens', value: input.openTiming ?? '' },
    { label: 'Open for', value: input.storeDuration ?? '' },
  ];

  return rows.filter(row => row.value.trim() !== '');
}

function generateText(input: EmailParams) {
  const details = inquiryDetails(input)
    .map(row => `${row.label}: ${row.value}`)
    .join('\n');

  return `${contactSubject(input, input.id)}\n\nName: ${input.firstName} ${
    input.lastName
  }\nEmail: ${input.email}\nPhone: ${formatPhoneNumber(input.phone)}\n${
    details ? `\n${details}\n` : ''
  }\nMessage: ${
    input.message
  }\n\n---\nSent from the contact form at macaport.com/contact.\nReplying to this email goes straight to ${input.firstName} at ${input.email}.\n`;
}

// The shell (page colour, logo, card border and radius) is deliberately the
// same as the customer confirmation: it is the same company sending both, and
// a shared container costs the reader nothing. What differs is the content.
// This one is a work item, so it leads with what decides triage — what the
// enquiry is about, who sent it, and how to reach them — rather than opening
// with a greeting.
function shellHtml({
  title,
  preheader,
  body,
  footer,
}: {
  title: string;
  preheader: string;
  body: string;
  footer: string;
}) {
  return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${escapeHtml(
    title
  )}</title></head><body style="margin:0;padding:0;background-color:${PAGE_BG};"><div style="display:none;font-size:1px;color:${PAGE_BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(
    preheader
  )}</div><div style="background-color:${PAGE_BG};margin:0;padding:24px 0;width:100%;"><table role="presentation" border="0" align="center" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td align="center"><div style="margin:0 auto;padding:8px 0 24px;"><img alt="Macaport" src="https://res.cloudinary.com/dra3wumrv/image/upload/v1621535049/macaport/logo-horizontal.png" style="display:block;border:0;outline:none;text-decoration:none;height:44px;" /></div></td></tr></tbody></table><div style="margin:0 auto;max-width:600px;width:100%;padding:0 16px;box-sizing:border-box;"><table role="presentation" width="100%" align="center" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td width="100%" align="left" valign="top" bgcolor="#FFFFFF" style="background-color:#FFFFFF;border:1px solid ${BORDER};border-radius:12px;box-sizing:border-box;padding:28px 24px 28px;">${body}</td></tr></tbody></table><table role="presentation" width="100%" align="center" border="0" cellpadding="0" cellspacing="0"><tbody><tr><td align="center" style="padding:24px 8px 32px;">${footer}</td></tr></tbody></table></div></div></body></html>`;
}

const footerLine = (content: string, last = false) =>
  `<p style="margin:0 0 ${
    last ? '0' : '10px'
  };color:#a1a1a1;font-family:${FONT};font-size:12px;line-height:1.5;text-align:center;">${content}</p>`;

export function generateHtml(input: EmailParams) {
  const name = `${input.firstName} ${input.lastName}`.trim();
  // "About" becomes the heading and "Needed by" the deadline line, so neither
  // is repeated in the rows below.
  const details = inquiryDetails(input).filter(
    row => row.label !== 'About' && row.label !== 'Needed by'
  );

  // Tappable on a phone, which is where these get read first. The reply-to on
  // this message is already the sender, but a forwarded copy loses that.
  const contactRows = [
    summaryRowHtml('Name', escapeHtml(name)),
    summaryRowHtml(
      'Email',
      `<a href="mailto:${escapeHtml(
        input.email
      )}" style="color:#0d6b2b;text-decoration:underline;">${escapeHtml(
        input.email
      )}</a>`
    ),
    summaryRowHtml(
      'Phone',
      `<a href="tel:${escapeHtml(
        input.phone.replace(/[^\d]/g, '')
      )}" style="color:#0d6b2b;text-decoration:underline;">${escapeHtml(
        input.phone
      )}</a>`,
      true
    ),
  ].join('');

  const detailRows = [
    ...details.map(row => summaryRowHtml(row.label, escapeHtml(row.value))),
    summaryRowHtml('Message', escapeMultiline(input.message), true),
  ].join('');

  // The date is what decides whether this waits until Monday, so it is hoisted
  // out of the rows rather than sitting tenth in a list. Pulled from the rows
  // above too, so it is stated once.
  //
  // "Date requested", not "Needed by": this is what the customer asked for, and
  // nobody has agreed to it yet. In a bordered callout at the top of the email,
  // "Needed by" reads like a commitment Macaport has already made.
  const deadline = input.neededBy?.trim()
    ? `<p style="margin:16px 0 0;padding:10px 14px;color:#171717;background-color:#fafafa;border:1px solid ${BORDER};border-radius:8px;font-family:${FONT};font-size:14px;line-height:1.5;"><span style="color:#737373;">Date requested</span> &nbsp;<b>${escapeHtml(
        formatDateValue(input.neededBy)
      )}</b></p>`
    : '';

  const body = `${eyebrow(
    'Contact form',
    0
  )}<h1 style="margin:6px 0 0;color:#171717;font-family:${FONT};font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-0.01em;">${escapeHtml(
    adminHeading(input.inquiryType)
  )}</h1>${metaLine(input.id, input.date)}${deadline}${divider(24)}${sectionHeading('Who sent it', 20)}${table(contactRows)}${sectionHeading('What they asked for', 22)}${table(
    detailRows
  )}`;

  // Two things an employee cannot see from the message itself: where it came
  // from, and that hitting reply answers the customer rather than the office.
  const footer = [
    footerLine(
      `Sent from the contact form at <a href="https://www.macaport.com/contact" style="color:#737373;text-decoration:underline;">macaport.com/contact</a>.`
    ),
    footerLine(
      `Replying to this email goes straight to ${escapeHtml(
        input.firstName
      )} at ${escapeHtml(input.email)}.`,
      true
    ),
  ].join('');

  return shellHtml({
    title: contactSubject(input, input.id),
    preheader: [adminHeading(input.inquiryType), name, input.phone]
      .filter(Boolean)
      .join(' \u00b7 '),
    body,
    footer,
  });
}

// Sent to the customer, not to Macaport. Its jobs, in order: prove the address
// they typed actually works, give them a durable copy of what they sent, and
// give them somewhere to reply if anything is wrong — so a correction lands in
// the same thread instead of arriving as a second, competing enquiry.
export function generateCustomerConfirmationEmail(
  message: Message,
  id: string,
  date: string
) {
  const input: EmailParams = {
    ...message,
    phone: formatPhoneNumber(message.phone),
    id,
    date,
  };
  const details = inquiryDetails(input);

  const summary = [
    `Name: ${input.firstName} ${input.lastName}`.trim(),
    `Email: ${input.email}`,
    `Phone: ${input.phone}`,
    ...details.map(row => `${row.label}: ${row.value}`),
  ].join('\n');

  const note = confirmationNote(input.inquiryType ?? '');

  const text = `Hi ${input.firstName},\n\nThanks for getting in touch with Macaport. ${nextStep(
    input.inquiryType ?? ''
  )}\n${note ? `\n${note}\n` : ''}\nHere is what you sent us on ${date} (reference #${id}):\n\n${
    summary ? `${summary}\n\n` : ''
  }Message: ${
    input.message
  }\n\nIf anything above is wrong, just reply to this email and it will reach us.\n\n---\nYou are receiving this because you sent a message through macaport.com/contact. It is not a marketing email, so there is nothing to unsubscribe from.\n\nmacaport.com | Privacy policy: macaport.com/privacy-policy | support@macaport.com\n${MACAPORT_ADDRESS}\n(c) ${new Date().getFullYear()} Macaport LLC. All rights reserved.\n`;

  // Their own contact details lead the echo. A transposed digit passes phone
  // validation, and this is the only place they can catch it — without these
  // rows "what you sent" is not actually what they sent.
  const rows = [
    summaryRowHtml('Name', escapeHtml(`${input.firstName} ${input.lastName}`.trim())),
    summaryRowHtml('Email', escapeHtml(input.email)),
    summaryRowHtml('Phone', escapeHtml(input.phone)),
    ...details.map(row => summaryRowHtml(row.label, escapeHtml(row.value))),
    summaryRowHtml('Message', escapeMultiline(input.message), true),
  ].join('');

  const noteHtml = note
    ? `<p style="margin:20px 0 0;padding:14px 16px;color:#171717;background-color:#f1f7f3;border:1px solid ${BORDER_BRAND};border-radius:10px;font-family:${FONT};font-size:14px;line-height:1.55;">${escapeHtml(
        note
      )}</p>`
    : '';

  // Same header shape as the notification: title, then reference and when it
  // arrived, then a rule. Without it the greeting ran straight into the list of
  // answers with nothing marking where one ended and the other began.
  const body = `${badge(
    'Message received'
  )}<h1 style="margin:0;color:#171717;font-family:${FONT};font-size:22px;line-height:1.25;font-weight:700;letter-spacing:-0.01em;">Thanks, ${escapeHtml(
    input.firstName
  )}. We got your message.</h1><p style="margin:10px 0 0;color:#737373;font-family:${FONT};font-size:15px;line-height:1.6;">${escapeHtml(
    nextStep(input.inquiryType ?? '')
  )}</p>${metaLine(id, date)}${noteHtml}${divider(24)}${sectionHeading('What you sent', 20)}${table(rows)}<p style="margin:22px 0 0;padding:14px 16px;color:#737373;background-color:#fafafa;border:1px solid ${BORDER};border-radius:10px;font-family:${FONT};font-size:13px;line-height:1.55;">If anything above is wrong, reply to this email and it will reach us.</p>`;

  const footer = [
    footerLine(
      `You are receiving this because you sent a message through <a href="https://www.macaport.com/contact" style="color:#737373;text-decoration:underline;">macaport.com/contact</a>. It is not a marketing email, so there is nothing to unsubscribe from.`
    ),
    footerLine(
      `<a href="https://www.macaport.com" style="color:#737373;text-decoration:underline;">macaport.com</a> &nbsp;&middot;&nbsp; <a href="https://www.macaport.com/privacy-policy" style="color:#737373;text-decoration:underline;">Privacy policy</a> &nbsp;&middot;&nbsp; <a href="mailto:support@macaport.com" style="color:#737373;text-decoration:underline;">support@macaport.com</a>`
    ),
    footerLine(MACAPORT_ADDRESS),
    footerLine(
      `&copy; ${new Date().getFullYear()} Macaport LLC. All rights reserved.`,
      true
    ),
  ].join('');

  const html = shellHtml({
    title: 'We got your message',
    preheader: `${nextStep(input.inquiryType ?? '')} Reference #${id}.`,
    body,
    footer,
  });

  return { text, html };
}

export function generateContactFormEmail(
  message: Message,
  id: string,
  date: string
) {
  const phone = formatPhoneNumber(message.phone);
  const text = generateText({ ...message, phone, id, date });
  const html = generateHtml({ ...message, phone, id, date });

  return { text, html };
}

function generateReceiptText(order: Order) {
  return `Hi ${order.customer.firstName},\n\nThis is confirmation for your ${
    order.store.name
  } order on macaport.com. \n\nOrder #: ${order.orderId} \nName: ${
    order.customer.firstName
  } ${order.customer.lastName} \nEmail: ${
    order.customer.email
  } \nPhone: ${formatPhoneNumber(order.customer.phone)} \n\nOrder Summary Link:
  ${`${process.env.API_HOST}/store/${order.store.id}/order-confirmation?orderId=${order.orderId}`}
    \n\nSubtotal: ${formatToMoney(
      order.summary.subtotal,
      true
    )} \nShipping: ${formatToMoney(
    order.summary.shipping,
    true
  )} \nSales Tax: ${formatToMoney(
    order.summary.salesTax,
    true
  )} \nTotal: ${formatToMoney(order.summary.total, true)}
  `;
}

function generateReceiptHtml(order: Order) {
  return `<!DOCTYPE html>
  <html lang="en">
    <head>
      <title>${escapeHtml(order.store.name)} | Macaport</title>
      <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <style type="text/css">
        /* CLIENT_SPECIFIC STYLES */
        body,
        table,
        td,
        a {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }
        table,
        td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }
        img {
          -ms-interpolation-mode: bicubic;
        }
  
        /* RESET STYLES */
        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none;
        }
        table {
          border-collapse: collapse !important;
        }
        body {
          height: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          width: 100% !important;
        }
  
        /* iOS BLUE LINKS */
        a[x-apple-data-detectors] {
          color: inherit !important;
          text-decoration: none !important;
          font-size: inherit !important;
          font-family: inherit !important;
          font-weight: inherit !important;
          line-height: inherit !important;
        }
  
        /* GMAIL BLUE LINKS */
        u + #body a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
  
        /* SAMSUNG MAIL BLUE LINKS */
        #MessageViewBody a {
          color: inherit;
          text-decoration: none;
          font-size: inherit;
          font-family: inherit;
          font-weight: inherit;
          line-height: inherit;
        }
  
        /* Universal styles for links and stuff */
  
        /* Responsive styles */
        @media screen and (max-width: 600px) {
          .mobile {
            padding: 0 !important;
            width: 100% !important;
          }
  
          .mobile-padding {
            padding: 0 24px !important;
          }
        }
  
        @media screen and (max-width: 500px) {
          .mobile-full-width {
            width: 100% !important;
          }
  
          .item-title {
            padding: 14px 0 0 !important;
            font-size: 12px !important;
            text-transform: uppercase !important;
            letter-spacing: 0.25px !important;
            font-weight: bold !important;
          }
        }
      </style>
    </head>
    <body
      id="body"
      style="
        margin: 0 !important;
        padding: 0 !important;
        background-color: #E5E7EB;
      "
    >
      <table
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        width="100%"
      >
        <tr>
          <td align="center" style="padding: 24px 0 0" class="mobile">
            <table
              class="mobile"
              border="0"
              cellpadding="0"
              cellspacing="0"
              role="presentation"
              width="600"
              bgcolor="#ffffff"
              style="
                background-color: #ffffff;
                color: #1F2937;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
                  Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue',
                  sans-serif;
                font-size: 18px;
                line-height: 36px;
                margin: 0;
                padding: 0;
              "
            >
              <tr>
                <td style="padding: 0 64px;" class="mobile-padding">
                  <table
                    class="mobile"
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    width="100%"
                  >
                    <!-- Logo -->
                    <tr>
                      <td align="center" style="padding: 40px 0 24px">
                        <img
                          src="https://res.cloudinary.com/dra3wumrv/image/upload/v1621535049/macaport/logo-horizontal-transparent.png"
                          alt="Macaport logo with mountains"
                          width="200"
                          style="display: block; margin: 0 auto"
                        />
                      </td>
                    </tr>
  
                    <!-- Store Title -->
                    <tr>
                      <td style="padding: 0; line-height: 1">
                        <h1
                          style="
                            margin: 0;
                            font-size: 20px;
                            font-weight: 400;
                            color: #111827;
                            text-align: center;
                          "
                        >
                          ${escapeHtml(order.store.name)}
                        </h1>
                      </td>
                    </tr>
  
                    <!-- Order ID -->
                    <tr>
                      <td style="padding: 0 0 24px">
                        <h1
                          style="
                            margin: 0;
                            padding: 8px 0;
                            font-size: 15px;
                            font-weight: 400;
                            color: #868f9d;
                            text-align: center;
                            line-height: 1;
                          "
                        >
                          Order #${escapeHtml(order.orderId)}
                        </h1>
                        ${
                          order.group
                            ? `<p style="margin: 0; padding: 0; font-size: 15px; font-weight: 400; color: #868f9d; text-align: center; line-height: 1;">${escapeHtml(order.group)}</p>`
                            : ''
                        }
                      </td>
                    </tr>
  
                    <!-- Order Details -->
                    <!-- First and Last Name -->
                    <tr>
                      <td style="font-size: 15px; line-height: 1.5">
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="70"
                        >
                          <tr>
                            <td
                              class="item-title"
                              style="color: #1F2937; font-weight: 500"
                            >
                              Name:
                            </td>
                          </tr>
                        </table>
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="300"
                        >
                          <tr>
                            <td style="color: #6B7280">
                              ${escapeHtml(order.customer.firstName)}
                              ${escapeHtml(order.customer.lastName)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <!-- Email Address -->
                    <tr>
                      <td style="font-size: 15px; line-height: 1.5">
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="70"
                        >
                          <tr>
                            <td
                              class="item-title"
                              style="color: #1F2937; font-weight: 500"
                            >
                              Email:
                            </td>
                          </tr>
                        </table>
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="300"
                        >
                          <tr>
                            <td style="color: #6B7280">
                              ${escapeHtml(order.customer.email)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <!-- Phone Number -->
                    <tr>
                      <td style="font-size: 15px; line-height: 1.5">
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="70"
                        >
                          <tr>
                            <td
                              class="item-title"
                              style="color: #1F2937; font-weight: 500"
                            >
                              Phone:
                            </td>
                          </tr>
                        </table>
                        <table
                          class="mobile-full-width"
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="300"
                        >
                          <tr>
                            <td style="color: #6B7280">
                              ${escapeHtml(formatPhoneNumber(order.customer.phone))}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <!-- Pickup message (if shipping method is primary) -->
                    ${
                      order.shippingMethod === 'Primary'
                        ? `
                    <tr>
                    <td style="padding: 24px 0 0; font-size: 15px; line-height: 1.5">
                      <table
                        class="mobile-full-width"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                      >
                        <tr>
                          <td
                            class="item-title"
                            style="color: #1F2937; font-weight: 500"
                          >
                            Order Pickup
                          </td>
                        </tr>
                      </table>
                      <table
                        class="mobile-full-width"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                      >
                        <tr>
                          <td style="color: #6B7280">
                            Your order will be shipped to the organizer of this store. Please contact them for pickup information.
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                    `
                        : ''
                    }

                    <!-- Shipping Address (if shipping method is store pickup) -->
                    ${
                      order.shippingMethod === 'Store Pickup'
                        ? `
                    <tr>
                      <td style="padding: 24px 0 0; font-size: 15px; line-height: 1.5">
                        <table
                          class="mobile-full-width"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td
                              class="item-title"
                              style="color: #1F2937; font-weight: 500"
                            >
                            Order Pickup
                            </td>
                          </tr>
                        </table>
                        <table
                          class="mobile-full-width"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td style="color: #6B7280">
                              <div style="margin: 10px 0 0 0">You selected to pick up your order at our store. We'll let you know when your order is ready. Our address is:</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #6B7280; margin: 16px 0 0 0">
                              <div style="margin: 16px 0 0 0">3080 Frederick Farm Ln. Suite 101</div>
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #6B7280">
                              New London, WI 54961
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    `
                        : ''
                    }

                    <!-- Shipping Address (if shipping method is direct) -->
                    ${
                      order.shippingMethod === 'Direct'
                        ? `
                    <tr>
                      <td style="padding: 24px 0 0; font-size: 15px; line-height: 1.5">
                        <table
                          class="mobile-full-width"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td
                              class="item-title"
                              style="color: #1F2937; font-weight: 500"
                            >
                              Shipping Address
                            </td>
                          </tr>
                        </table>
                        <table
                          class="mobile-full-width"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                        >
                          <tr>
                            <td style="color: #6B7280">
                              ${escapeHtml(order.customer.firstName)} ${escapeHtml(order.customer.lastName)}
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #6B7280">
                              ${escapeHtml(order.shippingAddress.street)} ${escapeHtml(order.shippingAddress.street2)}
                            </td>
                          </tr>
                          <tr>
                            <td style="color: #6B7280">
                              ${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.state)} ${escapeHtml(order.shippingAddress.zipcode)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    `
                        : ''
                    }

                    <!-- View Order Items Button -->
                    <tr>
                    <td style="padding: 24px 0 0; font-size: 15px; line-height: 1.5">
                      <table
                        class="mobile-full-width"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                      >
                        <tr>
                          <td
                            class="item-title"
                            style="color: #1F2937; font-weight: 500"
                          >
                          Order Items
                          </td>
                        </tr>
                      </table>
                      <table
                        class="mobile-full-width"
                        border="0"
                        cellpadding="0"
                        cellspacing="0"
                        role="presentation"
                      >
                        <tr>
                          <td style="color: #6B7280">
                          <div style="margin: 10px 0 0 0">For all order details and order items please <a href="${
                            process.env.API_HOST
                          }/store/${
    encodeURIComponent(order.store.id)
  }/order-confirmation?orderId=${
    encodeURIComponent(order.orderId)
  }" style="color: #4338CA; text-decoration: underline">click here</a>.</div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
  
                    <!-- Order Totals -->
                    <tr>
                      <td
                        style="
                          padding: 32px 0 42px;
                          font-size: 15px;
                          color: #6B7280;
                          line-height: 1.5;
                        "
                      >
                        <table
                          align="left"
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="240"
                        >
                          <tr>
                            <td style="padding: 0 0 2px">Subtotal:</td>
                            <td style="padding: 0 0 2px; text-align: right; color: #1F2937">
                              ${formatToMoney(order.summary.subtotal, true)}
                            </td>
                          </tr>
                          ${
                            order.sheboyganLutheranStaffDiscount
                              ? `<tr>
                            <td style="padding: 0 0 2px">Discount:</td>
                            <td style="padding: 0 0 2px; text-align: right; color: #1F2937">
                              -${formatToMoney(
                                order.summary.discount || 0,
                                true
                              )}
                            </td>
                          </tr>`
                              : ``
                          }
                          ${
                            order.switchFitnessDiscount
                              ? `<tr>
                            <td style="padding: 0 0 2px">Discount:</td>
                            <td style="padding: 0 0 2px; text-align: right; color: #1F2937">
                              -${formatToMoney(
                                order.summary.discount || 0,
                                true
                              )}
                            </td>
                          </tr>`
                              : ``
                          }
                          <tr>
                            <td style="padding: 0 0 2px">Sales Tax:</td>
                            <td style="padding: 0 0 2px; text-align: right; color: #1F2937">
                              ${formatToMoney(order.summary.salesTax, true)}
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 0 0 2px">Shipping:</td>
                            <td style="padding: 0 0 2px; text-align: right; color: #1F2937">
                              ${formatToMoney(order.summary.shipping, true)}
                            </td>
                          </tr>
                          <tr>
                            <td style="font-weight: 600; color: #1F2937">
                              Total:
                            </td>
                            <td
                              style="
                                text-align: right;
                                font-weight: 600;
                                color: #059669;
                              "
                            >
                              ${formatToMoney(order.summary.total, true)}
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
  
                    <!-- Questions and contact -->
                    <tr>
                      <td>
                        <table
                          border="0"
                          cellpadding="0"
                          cellspacing="0"
                          role="presentation"
                          width="100%"
                        >
                          <tr>
                            <td
                              style="
                                padding: 28px 0;
                                font-size: 16px;
                                color: #6B7280;
                                line-height: 1.5;
                                border-top: 1px solid #E5E7EB;
                                border-bottom: 1px solid #E5E7EB;
                              "
                            >
                              <p style="margin: 0">
                                If you have any questions about your payment or order,
                                please contact us at
                                <a
                                  href="mailto:support@macaport.com?subject=Order Inquiry [Order #${
                                    encodeURIComponent(order.orderId)
                                  }]"
                                  style="color: #4338CA; text-decoration: none"
                                  >support@macaport.com</a
                                >.
                              </p>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
  
                    <!-- Footer -->
                    <tr>
                      <td
                        style="
                          padding: 40px 0;
                          color: #6B7280;
                          font-size: 14px;
                          line-height: 1.3;
                        "
                      >
                        <p style="margin: 0 0 20px 0">
                          You're receiving this email because you made a purchase
                        from the ${escapeHtml(order.store.name)} store by <a href="${
    process.env.API_HOST
  }" style="color: #4338CA; text-decoration: none">Macaport LLC</a>.
                        </p>
                        <p style="margin: 0 0 20px 0">
                          <a href="${process.env.API_HOST}/store/${
    encodeURIComponent(order.store.id)
  }/order-confirmation?orderId=${
    encodeURIComponent(order.orderId)
  }" style="color: #4338CA; text-decoration: none">Click here</a> to view your order in the web browser.
                        </p>
                        <p style="margin: 0">
                          ${MACAPORT_ADDRESS}
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export function generateReceiptEmail(order: Order) {
  const text = generateReceiptText(order);
  const html = generateReceiptHtml(order);
  return { text, html };
}
