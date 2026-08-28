import { Db, OptionalId } from 'mongodb';

import {
  ContactFormValues,
  ContactMessage,
  ContactRequestMeta,
} from 'interfaces';

const COLLECTION = 'contactMessages';

// No index on referenceId. Lookups by reference happen when someone chases an
// enquiry by hand, which at this volume is a handful of documents scanned. Add
// one in Atlas if the collection ever grows enough to notice.
//
// Retention, on `meta`: a Mongo TTL index expires whole documents, and the
// document here is the lead. There is no index that drops the request metadata
// and keeps the enquiry, so ageing `meta` out means either a second collection
// or a scheduled `$unset` — neither of which is worth building before anyone
// has needed it. What this leaves is metadata kept for as long as the lead is,
// which is a decision rather than an oversight, and the one to revisit first if
// the retention question ever comes up.
export async function createContactMessage(
  db: Db,
  values: ContactFormValues,
  referenceId: string,
  submittedAt: Date,
  meta: ContactRequestMeta
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
    // Its own field rather than folded into `submission`, so that reading the
    // record never blurs what the customer told us with what their browser did.
    meta,
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
