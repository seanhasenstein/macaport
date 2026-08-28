import { Db } from 'mongodb';
import {
  createContactMessage,
  markDelivered,
} from '../../db/contactMessage';
import { ContactFormValues, ContactRequestMeta } from '../../interfaces';
import { initialValues } from '../contact';

const REFERENCE = '8FK2QP';
const SUBMITTED_AT = new Date('2026-08-15T14:00:00.000Z');

const submission = (o: Partial<ContactFormValues> = {}): ContactFormValues => ({
  ...initialValues,
  firstName: 'Sam',
  lastName: 'Rivera',
  email: 'sam@example.com',
  phone: '(920) 555-0134',
  message: 'Anything else you should know.',
  ...o,
});

const meta = (o: Partial<ContactRequestMeta> = {}): ContactRequestMeta => ({
  ip: '198.51.100.7',
  userAgent: 'Mozilla/5.0 (Macintosh)',
  referer: 'https://www.macaport.com/',
  acceptLanguage: 'en-US,en;q=0.9',
  durationMs: 184000,
  ...o,
});

// The route calls this through db/index, so the only thing worth exercising
// here is the document it builds. A real Db would be testing the driver.
const fakeDb = () => {
  const insertOne = jest.fn();
  const updateOne = jest.fn();

  return {
    db: { collection: () => ({ insertOne, updateOne }) } as unknown as Db,
    insertOne,
    updateOne,
  };
};

describe('the stored contact enquiry', () => {
  it('keeps the reference the customer was given', async () => {
    // Without this the number printed in both emails refers to nothing, and an
    // enquiry chased by reference can only be found by searching a mailbox.
    const { db, insertOne } = fakeDb();
    await createContactMessage(db, submission(), REFERENCE, SUBMITTED_AT, meta());

    expect(insertOne.mock.calls[0][0].referenceId).toBe(REFERENCE);
  });

  it('stores a real date rather than the string the emails read from', async () => {
    const { db, insertOne } = fakeDb();
    await createContactMessage(db, submission(), REFERENCE, SUBMITTED_AT, meta());

    expect(insertOne.mock.calls[0][0].submittedAt).toEqual(SUBMITTED_AT);
  });

  it('never keeps the honeypot', async () => {
    // The endpoint answers 200 and sends nothing when this is filled, so a
    // stored record should be unreachable. Belt and braces: if that check ever
    // moves, the bot text still must not land in the collection.
    const { db, insertOne } = fakeDb();
    await createContactMessage(
      db,
      submission({ honeypot: 'http://spam.example' }),
      REFERENCE,
      SUBMITTED_AT,
      meta()
    );

    const doc = insertOne.mock.calls[0][0];

    expect(doc.submission).not.toHaveProperty('honeypot');
    expect(JSON.stringify(doc)).not.toContain('spam.example');
  });

  it('keeps everything the customer actually filled in', async () => {
    const { db, insertOne } = fakeDb();
    await createContactMessage(
      db,
      submission({ inquiryType: 'onsite', eventName: 'Lincoln Invitational' }),
      REFERENCE,
      SUBMITTED_AT,
      meta()
    );

    const doc = insertOne.mock.calls[0][0];

    expect(doc.inquiryType).toBe('onsite');
    expect(doc.submission.eventName).toBe('Lincoln Invitational');
    expect(doc.submission.email).toBe('sam@example.com');
  });

  it('starts with both emails unsent', async () => {
    // The record is written before anything is sent, so this is the state that
    // survives a crash mid-send — and a notification still false is exactly
    // the lead worth going to look for.
    const { db, insertOne } = fakeDb();
    await createContactMessage(db, submission(), REFERENCE, SUBMITTED_AT, meta());

    expect(insertOne.mock.calls[0][0].delivery).toEqual({
      notification: false,
      confirmation: false,
    });
  });

  it('keeps what the request carried, apart from what the customer typed', async () => {
    // The separation is the point. Nobody answered any of this, and a reader
    // finding it under `submission` would take it for something they had.
    const { db, insertOne } = fakeDb();
    await createContactMessage(
      db,
      submission(),
      REFERENCE,
      SUBMITTED_AT,
      meta({ ip: '203.0.113.4' })
    );

    const doc = insertOne.mock.calls[0][0];

    expect(doc.meta.ip).toBe('203.0.113.4');
    expect(doc.submission).not.toHaveProperty('ip');
    expect(doc.submission).not.toHaveProperty('meta');
  });

  it('keeps the address readable rather than hashed', async () => {
    // Deliberate, and worth a test so it cannot be quietly "improved" later.
    // The use of an address is placing it and matching it against other
    // enquiries, and neither survives being made unreadable.
    const { db, insertOne } = fakeDb();
    await createContactMessage(
      db,
      submission(),
      REFERENCE,
      SUBMITTED_AT,
      meta({ ip: '203.0.113.4' })
    );

    expect(insertOne.mock.calls[0][0].meta.ip).toBe('203.0.113.4');
  });

  it('marks one email without disturbing the other', async () => {
    const { db, updateOne } = fakeDb();
    await markDelivered(db, REFERENCE, 'notification');

    expect(updateOne).toHaveBeenCalledWith(
      { referenceId: REFERENCE },
      { $set: { 'delivery.notification': true } }
    );
  });
});
