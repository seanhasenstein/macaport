import { generateContactFormEmail } from '../email';
import { initialValues, normalizeSubmission } from '../contact';
import { ContactFormValues } from '../../interfaces';

const submission = (o: Partial<ContactFormValues> = {}): ContactFormValues => ({
  ...initialValues,
  firstName: 'Sam',
  lastName: 'Rivera',
  email: 'sam@example.com',
  phone: '(920) 555-0134',
  message: 'Anything else you should know.',
  ...o,
});

describe('the shape an enquiry is stored in', () => {
  it('lowercases and trims the email address', () => {
    // Whatever their keyboard capitalised, and whatever a paste brought with
    // it. Two enquiries from one person have to look like one person.
    const values = normalizeSubmission(
      submission({ email: '  Sam.Rivera@Example.COM ' })
    );

    expect(values.email).toBe('sam.rivera@example.com');
  });

  it('keeps the phone as digits alone', () => {
    expect(normalizeSubmission(submission({ phone: '(920) 555-0134' })).phone).toBe(
      '9205550134'
    );
    expect(normalizeSubmission(submission({ phone: '920-555-0134' })).phone).toBe(
      '9205550134'
    );
    expect(normalizeSubmission(submission({ phone: '920.555.0134' })).phone).toBe(
      '9205550134'
    );
  });

  it('matches what a checkout stores, so a lead can be found in the orders', () => {
    // submit-order.ts writes customer details this way. The two collections
    // agreeing is the whole point — a lead that matches a past order is about
    // the strongest legitimacy signal available, and it is a signal that only
    // exists if both sides wrote the address and the number the same way.
    const values = normalizeSubmission(
      submission({ email: 'Sam@Example.com', phone: '(920) 555-0134' })
    );

    expect(values.email).toBe('sam@example.com');
    expect(values.phone).toBe('9205550134');
  });

  it('trims the name without touching its capitals', () => {
    const values = normalizeSubmission(
      submission({ firstName: '  Sam ', lastName: ' Rivera  ' })
    );

    expect(values.firstName).toBe('Sam');
    expect(values.lastName).toBe('Rivera');
  });

  it('survives a value that validated as a string without being one', () => {
    // Yup casts on validate without rewriting the body, so a phone posted as a
    // number reaches this as a number and would throw on .replace.
    const values = normalizeSubmission(
      submission({ phone: 9205550134 as unknown as string })
    );

    expect(values.phone).toBe('9205550134');
  });

  it('leaves every other answer exactly as it was given', () => {
    const values = normalizeSubmission(
      submission({
        inquiryType: 'apparel',
        organization: 'New London Rec',
        colors: 'Navy and White',
        message: '  Leading space is theirs to keep.',
      })
    );

    expect(values.organization).toBe('New London Rec');
    expect(values.colors).toBe('Navy and White');
    expect(values.message).toBe('  Leading space is theirs to keep.');
  });

  it('still renders a formatted phone in the email it is read from', () => {
    // Canonical in the database, formatted at the point of reading. If this
    // ever fails, the change cost a reader something rather than nothing.
    const values = normalizeSubmission(submission({ phone: '(920) 555-0134' }));
    const { text } = generateContactFormEmail(values, 'ABC123', 'August 28, 2026');

    expect(values.phone).toBe('9205550134');
    expect(text).toContain('Phone: (920) 555-0134');
  });
});
