import {
  generateContactFormEmail,
  generateCustomerConfirmationEmail,
} from '../email';
import { ContactFormValues } from '../../interfaces';
import { initialValues } from '../contact';

const ID = 'ABC123';
const DATE = '08/12/2026 at 9:00am (CT)';

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
      delivery: 'Free local pickup',
      organization: 'New London Rec',
    });

    expect(text).toContain('About: A new custom apparel order');
    // The quantity belongs beside the item it counts, and a range survives.
    expect(text).toContain(
      'Products: T-shirts (24), Hoodies & crewnecks (20-40)'
    );
    expect(text).toContain('Decoration: Embroidered');
    expect(text).toContain('Artwork: I have something rough');
    expect(text).toContain('Fabric: Cotton, Performance / moisture-wicking');
    expect(text).toContain('Colors: navy and white');
    expect(text).toContain('Needed by: 2026-09-15');
    expect(text).toContain('Delivery: Free local pickup');
    expect(html).toContain('<b>Products</b>');
    expect(html).toContain('<b>Decoration</b>');
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
      shipping: ['pickup', 'direct'],
    });

    expect(text).toContain('About: Setting up an online store');
    expect(text).toContain('Organization: Wildcats Booster Club');
    // When it opens and how long it runs are separate answers now.
    expect(text).toContain('Store opens: Within a month');
    expect(text).toContain('Open for: Open permanently');
    expect(text).toContain('Needed by: 2026-09-05');
    expect(text).toContain(
      'Store fulfillment: Store pickup, Ship to each person'
    );
    // Quantities are meaningless for a store, so no number is invented.
    expect(text).toContain('Products: Hoodies & crewnecks\n');
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
    expect(html).not.toContain('<b>Products</b>');
    expect(html).toContain('<b>Message</b>');
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
    expect(html).toContain('Thanks, Sam. We got your message.');
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
    expect(text).toContain('Decoration: Embroidered');
    expect(text).toContain('Message: Anything else you should know.');
    expect(text).toContain(`reference #${ID}`);
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
