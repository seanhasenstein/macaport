import {
  contactSubject,
  customerSubject,
  generateContactFormEmail,
  generateCustomerConfirmationEmail,
} from '../email';
import { formatDateValue } from '../index';
import { ContactFormValues, InquiryType } from '../../interfaces';
import {
  initialValues,
  ONSITE_PRODUCT_OPTIONS,
  PRODUCT_OPTIONS,
  SIZE_MIX_OPTIONS,
} from '../contact';

const ID = 'ABC123';
const DATE = 'August 12, 2026 at 9:00am (CT)';

const submission = (
  overrides: Partial<ContactFormValues>
): ContactFormValues => ({
  ...initialValues,
  firstName: 'Sam',
  lastName: 'Rivera',
  email: 'sam@example.com',
  phone: '(920) 555-0134',
  message: 'Anything else you should know.',
  ...overrides,
});

const generate = (overrides: Partial<ContactFormValues>) =>
  generateContactFormEmail(submission(overrides), ID, DATE);

describe('contact form notification email', () => {
  it('renders an apparel enquiry with per-item quantities', () => {
    const { text, html } = generate({
      inquiryType: 'apparel',
      products: ['tshirts', 'hoodies'],
      quantities: { tshirts: '24', hoodies: '20-40' },
      decoration: 'Embroidered',
      artwork: 'I have something rough',
      fabric: ['cotton', 'performance'],
      colors: 'navy and white',
      neededBy: '2026-09-15',
      delivery: 'Free pickup at Macaport in New London',
      organization: 'New London Rec',
    });

    expect(text).toContain('About: A new custom apparel order');
    // The quantity belongs beside the item it counts, and a range survives.
    expect(text).toContain(
      'Products: T-shirts (24), Hoodies (20-40)'
    );
    expect(text).toContain('Printed or embroidered: Embroidered');
    expect(text).toContain('Artwork ready: I have something rough');
    expect(text).toContain('Fabric: Cotton, Performance / moisture-wicking');
    expect(text).toContain('Garment colors: navy and white');
    expect(text).toContain('Needed by: September 15, 2026');
    expect(text).toContain(
      'Pickup or shipping: Free pickup at Macaport in New London'
    );
    expect(html).toContain('>Products</div>');
    expect(html).toContain('>Printed or embroidered</div>');
  });

  it('resolves ids to labels rather than leaking them', () => {
    const { text } = generate({
      inquiryType: 'apparel',
      products: ['quarter-zips', 'bags'],
      quantities: { 'quarter-zips': '12', bags: '12' },
    });

    expect(text).toContain('Quarter zips (12), Bags & backpacks (12)');
    expect(text).not.toContain('quarter-zips');
  });

  it('renders a team store enquiry with its fulfillment choices', () => {
    const { text } = generate({
      inquiryType: 'team-store',
      organization: 'Wildcats Booster Club',
      groupSize: '40',
      openTiming: 'Within a month',
      storeDuration: 'Open permanently',
      neededBy: '2026-09-05',
      products: ['hoodies'],
      shipping: ['pickup', 'pickup-group', 'direct'],
    });

    expect(text).toContain('About: Setting up an online store');
    expect(text).toContain('Organization or group: Wildcats Booster Club');
    // When it opens and how long it runs are separate answers now.
    expect(text).toContain('Store opens: Within a month');
    expect(text).toContain('Open for: Open permanently');
    expect(text).toContain('Needed by: September 5, 2026');
    expect(text).toContain(
      'How people get their orders: Individual pickup, Group pickup, Ship to each person'
    );
    // Quantities are meaningless for a store, so no number is invented.
    expect(text).toContain('Products: Hoodies\n');
  });

  it('renders an existing order enquiry with its reference', () => {
    const { text } = generate({
      inquiryType: 'existing',
      organization: 'New London Gridiron Club',
      orderNumber: '8FK2QP',
    });

    expect(text).toContain(
      'About: A question about an existing order or store'
    );
    expect(text).toContain('Order number: 8FK2QP');
  });

  it('carries the free-text item when "Something else" is picked', () => {
    const { text } = generate({
      inquiryType: 'apparel',
      products: ['other'],
      quantities: { other: '50' },
      productOther: 'aprons',
    });

    expect(text).toContain('Also looking for: aprons');
  });

  it('drops every unanswered row instead of rendering it blank', () => {
    const { text, html } = generate({ inquiryType: 'gang-sheets' });

    expect(text).toContain('About: DTF gang sheets');
    expect(text).not.toContain('Products:');
    expect(text).not.toContain('Fabric:');
    expect(text).not.toContain('Order number:');
    expect(html).not.toContain('>Products</div>');
    expect(html).toContain('>Message</div>');
  });

  it('always carries the contact details and the message', () => {
    const { text, html } = generate({ inquiryType: 'other' });

    expect(text).toContain('Name: Sam Rivera');
    expect(text).toContain('Email: sam@example.com');
    expect(text).toContain('Phone: (920) 555-0134');
    expect(text).toContain('Message: Anything else you should know.');
    expect(html).toContain('sam@example.com');
  });
});

describe('customer confirmation email', () => {
  it('opens with their name and the next step for their path', () => {
    const { text, html } = generateCustomerConfirmationEmail(
      submission({
        inquiryType: 'apparel',
        products: ['tshirts'],
        quantities: { tshirts: '24' },
        decoration: 'Printed',
      }),
      ID,
      DATE
    );

    expect(text).toContain('Hi Sam,');
    expect(text).toContain('We will put a price together and get back to you.');
    expect(html).toContain('Thanks, Sam.');
    expect(html).toContain('Quote request received');
  });

  it('gives them back what they sent, including the message', () => {
    const { text } = generateCustomerConfirmationEmail(
      submission({
        inquiryType: 'apparel',
        products: ['tshirts', 'hats'],
        quantities: { tshirts: '24', hats: '12' },
        decoration: 'Embroidered',
      }),
      ID,
      DATE
    );

    expect(text).toContain('Products: T-shirts (24), Hats (12)');
    expect(text).toContain('Printed or embroidered: Embroidered');
    expect(text).toContain('Message: Anything else you should know.');
    expect(text).toContain(`reference #${ID}`);
  });

  it('repeats the path disclaimer, restated now that it has been sent', () => {
    const { text, html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'apparel' }),
      ID,
      DATE
    );

    expect(text).toContain('This is not an order.');
    expect(html).toContain('This is not an order.');
  });

  it('leaves the disclaimer out where nothing can be mistaken for an order', () => {
    const { text, html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'gang-sheets' }),
      ID,
      DATE
    );

    expect(text).not.toContain('This is not an order');
    expect(html).not.toContain('This is not an order');
  });

  it('carries the postal address and why the email arrived', () => {
    const { text, html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'other' }),
      ID,
      DATE
    );

    expect(text).toContain('New London, WI 54961');
    expect(html).toContain('New London, WI 54961');
    expect(html).toContain('You are receiving this because you sent a message');
  });

  it('escapes markup typed into the form instead of rendering it', () => {
    const { html } = generateCustomerConfirmationEmail(
      submission({
        inquiryType: 'other',
        message: '<script>alert(1)</script>',
        firstName: 'Sam & "Jo"',
      }),
      ID,
      DATE
    );

    expect(html).not.toContain('<script>');
    expect(html).toContain('&lt;script&gt;');
    expect(html).toContain('Sam &amp; &quot;Jo&quot;');
  });

  it('keeps the line breaks someone typed into their message', () => {
    const { html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'other', message: 'One line.\nAnother line.' }),
      ID,
      DATE
    );

    expect(html).toContain('One line.<br />Another line.');
  });

  it('tells them replying reaches us, so a fix is not a second enquiry', () => {
    const { text, html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'other' }),
      ID,
      DATE
    );

    expect(text).toContain('reply to this email');
    expect(html).toContain('reply to this email');
  });
});

describe('notification email to Macaport', () => {
  it('escapes markup so a stranger cannot inject it into the inbox', () => {
    const { html } = generate({
      inquiryType: 'other',
      message: '<img src=x onerror="alert(1)">',
      organization: 'Wild & Co <b>',
    });

    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x');
    expect(html).toContain('Wild &amp; Co &lt;b&gt;');
  });
});

describe('the organization field, which every path asks differently', () => {
  it.each<[InquiryType, string]>([
    ['apparel', 'Team or organization'],
    ['team-store', 'Organization or group'],
    ['existing', 'Store name'],
    ['missed-deadline', 'Store missed'],
  ])('labels it for the %s path as "%s"', (inquiryType, label) => {
    const { text } = generate({ inquiryType, organization: 'Wildcats' });
    expect(text).toContain(`${label}: Wildcats`);
    expect(text).not.toContain('Organization: Wildcats');
  });
});

describe('the subject line, which is where triage starts', () => {
  it('says what the request is and who it is from', () => {
    expect(contactSubject(submission({ inquiryType: 'apparel' }), ID)).toBe(
      'Apparel quote request from Sam Rivera [#ABC123]'
    );
  });

  it('names the request rather than echoing the customer-facing option', () => {
    // "A new custom apparel order" in a subject reads like an order was placed.
    expect(
      contactSubject(submission({ inquiryType: 'apparel' }), ID)
    ).not.toContain('A new custom apparel order');
  });

  it.each<[InquiryType, string]>([
    ['team-store', 'Online store request'],
    ['gang-sheets', 'Gang sheet question'],
    ['existing', 'Question about an existing order'],
    ['missed-deadline', 'Missed store deadline'],
    ['other', 'General inquiry'],
  ])('describes the %s path as "%s"', (inquiryType, heading) => {
    expect(contactSubject(submission({ inquiryType }), ID)).toContain(heading);
  });

  it('hoists the deadline out of the rows so it is stated once', () => {
    const { html } = generate({ inquiryType: 'apparel', neededBy: '2026-09-15' });
    const occurrences = html.split('September 15, 2026').length - 1;

    expect(occurrences).toBe(1);
    expect(html).toContain('Date requested');
  });
});

describe('deadline formatting', () => {
  it('reads as a date rather than a database value', () => {
    expect(formatDateValue('2026-09-15')).toBe('September 15, 2026');
    expect(formatDateValue('2026-01-05')).toBe('January 5, 2026');
    expect(formatDateValue('2026-12-31')).toBe('December 31, 2026');
  });

  // A date-only string parses as UTC midnight, which is the previous evening
  // in Central time. Building from the parts is what keeps the day intact.
  it('does not shift the day backwards', () => {
    expect(formatDateValue('2026-09-15')).not.toContain('14');
    expect(formatDateValue('2026-01-01')).toBe('January 1, 2026');
  });

  it('passes through anything that is not a plain date', () => {
    expect(formatDateValue('')).toBe('');
    expect(formatDateValue(undefined)).toBe('');
    expect(formatDateValue('sometime in September')).toBe('sometime in September');
    expect(formatDateValue('2026-13-01')).toBe('2026-13-01');
  });

  it('formats the date in both emails, not just one', () => {
    const values = { inquiryType: 'apparel' as InquiryType, neededBy: '2026-09-15' };
    expect(generate(values).text).toContain('September 15, 2026');
    expect(
      generateCustomerConfirmationEmail(submission(values), ID, DATE).text
    ).toContain('September 15, 2026');
  });
});

describe('the header block both emails share', () => {
  it('shows the customer when they sent it, not just the reference', () => {
    const { html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'other' }),
      ID,
      DATE
    );

    expect(html).toContain(`Reference #${ID}`);
    expect(html).toContain(DATE);
  });

  it('states the reference in the header, not again at the bottom', () => {
    const { html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'other' }),
      ID,
      DATE
    );

    // Twice in the source, but only once on screen: the other is the hidden
    // preheader that mail clients show beside the subject in the inbox list.
    expect(html.split(ID).length - 1).toBe(2);
    expect(html).toContain('display:none');
    expect(html).not.toContain(`reach us. Reference #${ID}`);
  });

  it('rules off the header before the detail starts', () => {
    const customer = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'other' }),
      ID,
      DATE
    ).html;
    const admin = generate({ inquiryType: 'other' }).html;

    // The hairline divider, which is what separates header from body.
    expect(customer).toContain('height:1px;background-color:#d4d4d4');
    expect(admin).toContain('height:1px;background-color:#d4d4d4');
  });
});

describe('the disclaimer, which must add to the next step rather than echo it', () => {
  it.each<[InquiryType, string]>([
    ['apparel', 'Nothing gets printed until you have approved'],
    ['team-store', 'Nothing is set up until we have gone through the details'],
  ])('gives the %s path something its lede does not say', (inquiryType, unique) => {
    const { text } = generateCustomerConfirmationEmail(
      submission({ inquiryType }),
      ID,
      DATE
    );

    expect(text).toContain(unique);
    // The phrase the lede already uses must not come back in the callout.
    expect(text).not.toContain('We will come back with pricing');
  });
});

describe('what the copy promises on Macaport behalf', () => {
  it('does not treat the store going live as already agreed', () => {
    const { text, html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'team-store' }),
      ID,
      DATE
    );

    // Macaport has not taken the job on yet: the dates, the group size and the
    // artwork are all still open, so nothing here may presume the outcome.
    expect(text).not.toContain('before anything goes live');
    expect(html).not.toContain('before anything goes live');
    expect(text).not.toContain('You will see it and approve it');
    expect(text).toContain('let you know what we can do');
  });

  it('states the apparel note as a constraint, not a commitment to print', () => {
    const { text } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'apparel' }),
      ID,
      DATE
    );

    expect(text).toContain('Nothing gets printed until');
    expect(text).not.toContain('we will print');
  });
});

describe('the badge and the requested date', () => {
  it.each<[InquiryType, string]>([
    ['apparel', 'Quote request received'],
    ['team-store', 'Store request received'],
    ['gang-sheets', 'Question received'],
    ['onsite', 'Event request received'],
    ['existing', 'Question received'],
    ['missed-deadline', 'Request received'],
    ['other', 'Message received'],
  ])('names what arrived on the %s path', (inquiryType, label) => {
    const { html } = generateCustomerConfirmationEmail(
      submission({ inquiryType }),
      ID,
      DATE
    );

    expect(html).toContain(label);
    // The heading stops repeating it: the badge says what, the heading thanks.
    expect(html).not.toContain('We got your message.');
  });

  it('keeps the badge to text, since icons and symbol fonts are unreliable', () => {
    const { html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'other' }),
      ID,
      DATE
    );

    expect(html).not.toContain('&#10003;');
    expect(html).not.toContain('✓');
    expect(html).not.toContain('<svg');
  });

  it('calls the date a request in the notification, not a commitment', () => {
    const { html } = generate({ inquiryType: 'apparel', neededBy: '2026-09-15' });

    expect(html).toContain('Date requested');
    expect(html).toContain('September 15, 2026');
  });

  it('still echoes the customer their own form wording', () => {
    // They answered a question labelled "Needed by", so that is what comes back.
    const { text } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'apparel', neededBy: '2026-09-15' }),
      ID,
      DATE
    );

    expect(text).toContain('Needed by: September 15, 2026');
  });
});

// The badge can only name a kind of enquiry, so on its own it repeats itself
// across paths — gang-sheets and existing both produce "Question received".
// The heading is what tells them apart, because its second half is theirs.
describe('the heading, which names what the customer named', () => {
  const heading = (overrides: Partial<ContactFormValues>) =>
    generateCustomerConfirmationEmail(submission(overrides), ID, DATE).html;

  it.each<[string, Partial<ContactFormValues>, string]>([
    [
      'onsite',
      { inquiryType: 'onsite', eventName: 'Lincoln Invitational' },
      'Thanks, Sam. We have your request for Lincoln Invitational.',
    ],
    [
      'team-store',
      { inquiryType: 'team-store', organization: 'Wildcats Booster Club' },
      'Thanks, Sam. We have your store request for Wildcats Booster Club.',
    ],
    [
      'apparel',
      { inquiryType: 'apparel', organization: 'New London Gridiron Club' },
      'Thanks, Sam. We have your quote request for New London Gridiron Club.',
    ],
    [
      'missed-deadline',
      { inquiryType: 'missed-deadline', organization: 'Waupaca Hockey' },
      'Thanks, Sam. We have your request about Waupaca Hockey.',
    ],
    [
      'existing, by order number',
      { inquiryType: 'existing', orderNumber: '8FK2QP' },
      'Thanks, Sam. We have your question about order #8FK2QP.',
    ],
    [
      'existing, by store name',
      { inquiryType: 'existing', organization: 'Waupaca Hockey' },
      'Thanks, Sam. We have your question about Waupaca Hockey.',
    ],
  ])('names it on the %s path', (_label, overrides, expected) => {
    expect(heading(overrides)).toContain(expected);
  });

  // "About", not "for". They are asking after a store that already exists, and
  // "for Waupaca Hockey" would read as a new job being quoted at them.
  it('does not offer to print for the store someone missed', () => {
    expect(heading({
      inquiryType: 'missed-deadline',
      organization: 'Waupaca Hockey',
    })).not.toContain('request for Waupaca Hockey');
  });

  // With no name to add, the long form is the badge again in a larger font,
  // which is the doubling this heading exists to remove.
  it.each<[string, Partial<ContactFormValues>]>([
    ['gang-sheets, which never asks for one', { inquiryType: 'gang-sheets' }],
    ['other, which never asks for one', { inquiryType: 'other' }],
    ['apparel, where organization is optional', { inquiryType: 'apparel' }],
    ['existing, where both fields are optional', { inquiryType: 'existing' }],
  ])('stops at the thanks on %s', (_label, overrides) => {
    const html = heading(overrides);

    expect(html).toContain('Thanks, Sam.</h1>');
    expect(html).not.toContain('We have your');
  });

  it('escapes a name the customer typed', () => {
    const html = heading({
      inquiryType: 'onsite',
      eventName: '<script>alert(1)</script>',
    });

    expect(html).not.toContain('<script>alert(1)</script>');
    expect(html).toContain('&lt;script&gt;');
  });
});

// Neither field is length-limited on the form, because refusing a submission
// over a display concern would turn away a lead. So an overlong value has to
// fail somewhere, and the heading is the right place for it to fail.
describe('a name too long to be a heading', () => {
  const longName = 'The Annual '.repeat(12);

  it('leaves it out rather than setting a paragraph in 22px bold', () => {
    const { html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'onsite', eventName: longName }),
      ID,
      DATE
    );

    expect(html).toContain('Thanks, Sam.</h1>');
    expect(html).not.toContain('We have your request for The Annual');
  });

  it('still reports it in full where length does not matter', () => {
    // Dropping it from the heading must not drop it from the record of what
    // they sent, which is the part they check for mistakes.
    const { text } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'onsite', eventName: longName }),
      ID,
      DATE
    );

    expect(text).toContain(`Event: ${longName}`);
  });

  it('collapses a newline pasted into the middle of a name', () => {
    // Invisible in the heading, but it would break the plain-text sentence
    // across two lines and read as a formatting bug.
    const { html, text } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'onsite', eventName: 'Lincoln\n Invitational' }),
      ID,
      DATE
    );

    expect(html).toContain('We have your request for Lincoln Invitational.');
    expect(text).toContain('We have your request for Lincoln Invitational.');
  });
});

// No badge here, so this was never repeating itself the way the heading was.
// It says the same thing for parity: the two parts of a multipart message
// should agree, and this is the part that gets indexed by mail search.
describe('the plain-text opening', () => {
  it('names the event alongside the thanks and the next step', () => {
    const { text } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'onsite', eventName: 'Lincoln Invitational' }),
      ID,
      DATE
    );

    expect(text).toContain(
      'Thanks for getting in touch with Macaport. We have your request for Lincoln Invitational. We will'
    );
  });

  it('reads exactly as it did before when there is nothing to name', () => {
    const { text } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'gang-sheets' }),
      ID,
      DATE
    );

    expect(text).toContain('Thanks for getting in touch with Macaport. We');
    expect(text).not.toContain('We have your');
  });

  it('agrees with the heading on every path', () => {
    const paths: [InquiryType, Partial<ContactFormValues>][] = [
      ['apparel', { organization: 'New London Gridiron Club' }],
      ['team-store', { organization: 'Wildcats Booster Club' }],
      ['gang-sheets', {}],
      ['onsite', { eventName: 'Lincoln Invitational' }],
      ['existing', { orderNumber: '8FK2QP' }],
      ['missed-deadline', { organization: 'Waupaca Hockey' }],
      ['other', {}],
    ];

    paths.forEach(([inquiryType, overrides]) => {
      const { html, text } = generateCustomerConfirmationEmail(
        submission({ inquiryType, ...overrides }),
        ID,
        DATE
      );
      const clause = html
        .match(/<h1[^>]*>Thanks, Sam\.(.*?)<\/h1>/)?.[1]
        ?.trim();

      // Either both carry the clause or neither does. One source of truth is
      // only worth having if a test would notice it forking.
      expect(text.includes('We have your')).toBe(Boolean(clause));
      if (clause) expect(text).toContain(clause);
    });
  });
});

describe('field audit', () => {
  it('drops the free-text item once its checkbox is unticked', () => {
    // Ticking "Something else" and typing into it leaves the text behind in
    // Formik state when the box is unticked again.
    const { text } = generate({
      inquiryType: 'apparel',
      products: ['tshirts'],
      quantities: { tshirts: '24' },
      productOther: 'aprons',
    });

    expect(text).not.toContain('aprons');
  });

  it('keeps it while the checkbox is still ticked', () => {
    const { text } = generate({
      inquiryType: 'apparel',
      products: ['tshirts', 'other'],
      quantities: { tshirts: '24', other: '10' },
      productOther: 'aprons',
    });

    expect(text).toContain('Also looking for: aprons');
  });

  it('ignores a quantity left behind by a deselected item', () => {
    const { text } = generate({
      inquiryType: 'apparel',
      products: ['tshirts'],
      quantities: { tshirts: '24', hats: '99' },
    });

    expect(text).not.toContain('99');
  });

  it('echoes the contact details a typo would sink', () => {
    const { text, html } = generateCustomerConfirmationEmail(
      submission({ inquiryType: 'gang-sheets' }),
      ID,
      DATE
    );

    expect(text).toContain('Name: Sam Rivera');
    expect(text).toContain('Email: sam@example.com');
    expect(text).toContain('Phone: (920) 555-0134');
    expect(html).toContain('(920) 555-0134');
  });

  it('never renders the honeypot', () => {
    const { text, html } = generate({
      inquiryType: 'other',
      honeypot: 'SPAMBOT',
    });

    expect(text).not.toContain('SPAMBOT');
    expect(html).not.toContain('SPAMBOT');
  });
});

describe('the subject header, which is the one place user text reaches a header', () => {
  it('collapses line breaks so they cannot reach the header', () => {
    const subject = contactSubject(
      submission({ inquiryType: 'apparel', firstName: 'Sam\r\nBcc: someone', lastName: 'Rivera' }),
      ID
    );

    expect(subject).not.toContain('\n');
    expect(subject).not.toContain('\r');
  });

  it('bounds the length so the useful part survives the inbox column', () => {
    const subject = contactSubject(
      submission({ inquiryType: 'apparel', firstName: 'A'.repeat(200), lastName: 'B'.repeat(200) }),
      ID
    );

    expect(subject).toContain('Apparel quote request');
    expect(subject).toContain(`[#${ID}]`);
    expect(subject.length).toBeLessThan(120);
  });

  it('still reads normally for an ordinary name', () => {
    expect(contactSubject(submission({ inquiryType: 'apparel' }), ID)).toBe(
      'Apparel quote request from Sam Rivera [#ABC123]'
    );
  });
});

describe('the confirmation subject the customer sees', () => {
  it.each<[InquiryType, string]>([
    ['apparel', 'We got your apparel quote request [#ABC123]'],
    ['team-store', 'We got your online store request [#ABC123]'],
    ['gang-sheets', 'We got your gang sheet question [#ABC123]'],
    ['existing', 'We got your question [#ABC123]'],
    ['other', 'We got your message [#ABC123]'],
  ])('names the %s enquiry so it can be found again later', (inquiryType, subject) => {
    expect(customerSubject(submission({ inquiryType }), ID)).toBe(subject);
  });

  it('does not name the missed deadline back at them', () => {
    // Fair as a work queue label, unkind in the inbox of someone apologising.
    // "Request" matches the button they pressed to get here.
    const subject = customerSubject(
      submission({ inquiryType: 'missed-deadline' }),
      ID
    );

    expect(subject).toBe('We got your request [#ABC123]');
    expect(subject).not.toMatch(/missed|deadline/i);
  });

  it('reads differently from the one Macaport gets', () => {
    const values = submission({ inquiryType: 'apparel' });

    expect(customerSubject(values, ID)).not.toBe(contactSubject(values, ID));
    expect(contactSubject(values, ID)).toContain('from Sam Rivera');
    expect(customerSubject(values, ID)).not.toContain('Sam Rivera');
  });
});

describe('the existing order or store path, which serves two audiences', () => {
  it('does not claim it was about an order when nothing says it was', () => {
    // The same enquiry covers "where is my order" and "when does my store
    // close", and with no order number the form cannot tell them apart.
    const asStoreOwner = customerSubject(
      submission({ inquiryType: 'existing', organization: 'Waupaca Hockey' }),
      ID
    );

    expect(asStoreOwner).not.toContain('order');
    expect(asStoreOwner).toBe(`We got your question [#${ID}]`);
  });

  it('uses the order number when they gave one, since that is a fact', () => {
    expect(
      customerSubject(
        submission({ inquiryType: 'existing', orderNumber: '8FK2QP' }),
        ID
      )
    ).toBe(`We got your question about order #8FK2QP [#${ID}]`);
  });

  it('ignores whitespace someone pasted around it', () => {
    expect(
      customerSubject(
        submission({ inquiryType: 'existing', orderNumber: '  8FK2QP  ' }),
        ID
      )
    ).toBe(`We got your question about order #8FK2QP [#${ID}]`);
  });

  it('never names an order on a path where none exists yet', () => {
    // A stale orderNumber can survive in Formik state after switching paths.
    expect(
      customerSubject(
        submission({ inquiryType: 'apparel', orderNumber: '8FK2QP' }),
        ID
      )
    ).toBe(`We got your apparel quote request [#${ID}]`);
  });
});

describe('the notification subject for an existing order', () => {
  it('carries the order number, which is the first thing looked up', () => {
    expect(
      contactSubject(
        submission({ inquiryType: 'existing', orderNumber: '8FK2QP' }),
        ID
      )
    ).toBe('Question about order #8FK2QP from Sam Rivera [#ABC123]');
  });

  it('falls back to the path name when they did not give one', () => {
    expect(
      contactSubject(submission({ inquiryType: 'existing' }), ID)
    ).toBe('Question about an existing order from Sam Rivera [#ABC123]');
  });
});

describe('fulfillment options', () => {
  it('tells the two kinds of pickup apart in the email', () => {
    // One box meaning both "everyone collects their own" and "the organizer
    // collects the lot" told Macaport nothing about which to set up.
    const { text } = generate({
      inquiryType: 'team-store',
      shipping: ['pickup', 'pickup-group'],
    });

    expect(text).toContain(
      'How people get their orders: Individual pickup, Group pickup'
    );
  });

  it('still resolves every id to a label rather than leaking one', () => {
    const { text } = generate({
      inquiryType: 'team-store',
      shipping: ['pickup', 'pickup-group', 'primary', 'direct'],
    });

    expect(text).not.toContain('pickup-group');
    expect(text).toContain('Ship to one address');
    expect(text).toContain('Ship to each person');
  });
});

describe('the onsite printing path', () => {
  const event = (o: Partial<ContactFormValues> = {}) =>
    submission({
      inquiryType: 'onsite',
      eventName: 'Lincoln Invitational',
      eventDates: 'March 14-16',
      eventHours: '8am to 4pm',
      venue: 'Lincoln High School, New London',
      venueSetting: 'Indoor',
      power: 'Yes, there is power',
      groupSize: '300',
      products: ['tshirts', 'hoodies'],
      ...o,
    });

  it('carries everything that decides whether the day is possible', () => {
    const { text } = generateContactFormEmail(event(), ID, DATE);

    expect(text).toContain('Event: Lincoln Invitational');
    expect(text).toContain('Dates: March 14-16');
    expect(text).toContain('Event times: 8am to 4pm');
    expect(text).toContain('Venue: Lincoln High School, New London');
    expect(text).toContain('Indoor or outdoor: Indoor');
    expect(text).toContain('Power on site: Yes, there is power');
      });

  it('calls the head count attendance, not group size', () => {
    // On a team store the same field is the size of the group ordering. At an
    // event it is how many people turn up, which is a different question.
    expect(generateContactFormEmail(event(), ID, DATE).text).toContain(
      'Expected attendance: 300'
    );
    expect(
      generateContactFormEmail(
        submission({ inquiryType: 'team-store', groupSize: '40' }),
        ID,
        DATE
      ).text
    ).toContain('Group size: 40');
  });

  it('does not leak event rows onto the other paths', () => {
    const { text } = generateContactFormEmail(
      submission({ inquiryType: 'apparel', products: ['tshirts'] }),
      ID,
      DATE
    );

    expect(text).not.toContain('Event:');
    expect(text).not.toContain('Who pays:');
    expect(text).not.toContain('Power on site:');
  });

  it('names the request in both subjects', () => {
    expect(contactSubject(event(), ID)).toBe(
      'Onsite printing request from Sam Rivera [#ABC123]'
    );
    expect(customerSubject(event(), ID)).toBe(
      'We got your onsite printing request [#ABC123]'
    );
  });

  it('does not let a sent form read as a booked date', () => {
    const { text } = generateCustomerConfirmationEmail(event(), ID, DATE);

    expect(text).toContain('We will check the date and let you know');
    expect(text).toContain('This does not book the date');
  });
});

describe('what to stock for an event', () => {
  it('reports the size mix by label, not by id', () => {
    const { text } = generateContactFormEmail(
      submission({
        inquiryType: 'onsite',
        eventName: 'Lincoln Invitational',
        eventDates: 'March 14-16',
        sizeMix: ['adult', 'youth'],
      }),
      ID,
      DATE
    );

    expect(text).toContain('Sizes to bring: Adult unisex, Youth');
    expect(text).not.toContain('womens');
  });

  it('drops the row when nothing was ticked', () => {
    const { text } = generateContactFormEmail(
      submission({
        inquiryType: 'onsite',
        eventName: 'Lincoln Invitational',
        eventDates: 'March 14-16',
      }),
      ID,
      DATE
    );

    expect(text).not.toContain('Sizes to bring');
  });
});

describe('personalization, which the form used to bury', () => {
  it('reports it by label on the paths that offer it', () => {
    const { text } = generateContactFormEmail(
      submission({
        inquiryType: 'apparel',
        products: ['tshirts'],
        personalization: ['names', 'numbers'],
      }),
      ID,
      DATE
    );

    expect(text).toContain('Personalization: Names, Numbers');
    expect(text).not.toContain('numbers,');
  });

  it('carries results too, which is what an event wants', () => {
    const { text } = generateContactFormEmail(
      submission({
        inquiryType: 'onsite',
        eventName: 'Lincoln Invitational',
        eventDates: 'March 14-16',
        personalization: ['names', 'results'],
        schedule: 'lincolninvitational.com/schedule',
      }),
      ID,
      DATE
    );

    expect(text).toContain('Personalization: Names, Event or result details');
    expect(text).toContain('Schedule: lincolninvitational.com/schedule');
  });

  it('drops both rows when neither was answered', () => {
    const { text } = generateContactFormEmail(
      submission({ inquiryType: 'other' }),
      ID,
      DATE
    );

    expect(text).not.toContain('Personalization:');
    expect(text).not.toContain('Schedule:');
  });
});

describe('the free-text behind "Something else" on personalization', () => {
  it('carries it while the box is ticked', () => {
    const { text } = generate({
      inquiryType: 'apparel',
      products: ['tshirts'],
      personalization: ['names', 'other'],
      personalizationOther: 'graduation year',
    });

    expect(text).toContain('Personalization detail: graduation year');
  });

  it('drops it once the box is unticked, like the products one', () => {
    // Formik keeps the text when the checkbox goes; reporting it would name
    // something the customer already took back off the list.
    const { text } = generate({
      inquiryType: 'apparel',
      products: ['tshirts'],
      personalization: ['names'],
      personalizationOther: 'graduation year',
    });

    expect(text).not.toContain('graduation year');
  });
});

describe('the date callout in the notification', () => {
  it('hoists the event dates on the onsite path', () => {
    const { html } = generate({
      inquiryType: 'onsite',
      eventName: 'Lincoln Invitational',
      eventDates: 'March 14-16',
    });

    expect(html).toContain('Event dates');
    expect(html).not.toContain('Date requested');
    // Once, not twice: hoisted out of the rows rather than copied above them.
    expect(html.split('March 14-16').length - 1).toBe(1);
  });

  it('still hoists the deadline everywhere else', () => {
    const { html } = generate({ inquiryType: 'apparel', neededBy: '2026-09-15' });

    expect(html).toContain('Date requested');
    expect(html).not.toContain('Event dates');
  });
});

describe('how the notification is ordered', () => {
  it('keeps the event facts together and the stock facts together', () => {
    const { text } = generate({
      inquiryType: 'onsite',
      eventName: 'Lincoln Invitational',
      eventDates: 'March 14-16',
      eventHours: 'Fri 4-9pm',
      venue: 'Lincoln High School',
      schedule: 'example.com/schedule',
      products: ['tshirts'],
      sizeMix: ['youth'],
      personalization: ['names'],
    });

    const at = (label: string) => text.indexOf(label);

    // Everything about the day, then everything about what comes off the van.
    expect(at('Event:')).toBeLessThan(at('Event times:'));
    expect(at('Event times:')).toBeLessThan(at('Venue:'));
    expect(at('Venue:')).toBeLessThan(at('Schedule:'));
    expect(at('Schedule:')).toBeLessThan(at('Products:'));
    expect(at('Products:')).toBeLessThan(at('Sizes to bring:'));
    expect(at('Sizes to bring:')).toBeLessThan(at('Personalization:'));
  });
});

// Nick's changes on 2026-08-19: a shorter print list, no women's cuts to stock,
// no question about money, and two new facts that decide what comes off the van.
describe('the onsite questions after the second pass', () => {
  it('carries the event type and who the day is for', () => {
    const { text } = generate({
      inquiryType: 'onsite',
      eventName: 'Lincoln Invitational',
      eventDates: 'March 14-16',
      eventType: 'Tournament or meet',
      audience: ['boys', 'girls'],
    });

    expect(text).toContain('Event type: Tournament or meet');
    expect(text).toContain('Who it is for: Boys, Girls');
  });

  it('offers only what can be printed at a venue', () => {
    expect(ONSITE_PRODUCT_OPTIONS.map(option => option.id)).toEqual([
      'tshirts',
      'long-sleeve',
      'hoodies',
    ]);
    // The quote form still offers the full catalogue; this is the shorter list.
    expect(PRODUCT_OPTIONS.length).toBeGreaterThan(
      ONSITE_PRODUCT_OPTIONS.length
    );
  });

  it('no longer asks who is paying', () => {
    const { text } = generate({
      inquiryType: 'onsite',
      eventName: 'Lincoln Invitational',
    });

    expect(text).not.toContain('Who pays');
  });

  it('stocks adult and youth only', () => {
    expect(SIZE_MIX_OPTIONS.map(option => option.id)).toEqual(['adult', 'youth']);
  });
});
