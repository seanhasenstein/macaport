import { Db, OptionalId } from 'mongodb';

import { ContactFormValues, ContactMessage } from 'interfaces';

const COLLECTION = 'contactMessages';

// No index on referenceId. Lookups by reference happen when someone chases an
// enquiry by hand, which at this volume is a handful of documents scanned. Add
// one in Atlas if the collection ever grows enough to notice.
export async function createContactMessage(
  db: Db,
  values: ContactFormValues,
  referenceId: string,
  submittedAt: Date
) {
  // Destructured out rather than deleted, so a honeypot value can never reach
  // the record even if the endpoint's own check is ever moved or removed.
  const { honeypot, ...submission } = values;

  await db.collection<OptionalId<ContactMessage>>(COLLECTION).insertOne({
    referenceId,
    submittedAt,
    inquiryType: values.inquiryType || '',
    submission,
    delivery: { notification: false, confirmation: false },
  });
}

// Called after each send returns. Separate from the insert because the record
// has to exist before anything is sent — if the process dies mid-send, the
// enquiry is still on disk, which is the entire point of keeping it.
export async function markDelivered(
  db: Db,
  referenceId: string,
  part: 'notification' | 'confirmation'
) {
  await db
    .collection<OptionalId<ContactMessage>>(COLLECTION)
    .updateOne({ referenceId }, { $set: { [`delivery.${part}`]: true } });
}
