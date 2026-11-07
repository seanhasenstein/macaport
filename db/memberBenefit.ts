import { Db, ObjectID } from 'mongodb';

import { MemberBenefit } from '../core/memberBenefits/types';
import { CodeRecord } from '../core/verification/code';

// The storefront reads benefits and records usage. It never creates or edits
// one: that is the dashboard's job (or scripts/create-member-benefit.js
// until the dashboard can). Usage is written only through
// core/memberBenefits/reservation.ts, which is the atomic part.

export async function getMemberBenefitById(db: Db, id: string) {
  if (!ObjectID.isValid(id)) return null;

  const benefit = await db
    .collection('memberBenefits')
    .findOne({ _id: new ObjectID(id) });

  if (!benefit) return null;

  const result: MemberBenefit = { ...benefit, _id: `${benefit._id}` };
  return result;
}

// One-time codes in flight, one document per benefit and email. Short-lived
// by nature, so the migration script puts a TTL index on `expires` and Mongo
// sweeps them; nothing here has to.
const CODES = 'memberBenefitCodes';

export async function getCodeRecord(db: Db, benefitId: string, email: string) {
  const record = await db.collection(CODES).findOne({ benefitId, email });
  return record ? (record as CodeRecord) : null;
}

export async function saveCodeRecord(db: Db, record: CodeRecord) {
  await db.collection(CODES).replaceOne(
    { benefitId: record.benefitId, email: record.email },
    // `expires` is a Date copy of expiresAt for the TTL index, which only
    // understands Dates.
    { ...record, expires: new Date(record.expiresAt) },
    { upsert: true }
  );
}

export async function recordWrongAttempt(
  db: Db,
  benefitId: string,
  email: string
) {
  await db
    .collection(CODES)
    .updateOne({ benefitId, email }, { $inc: { attempts: 1 } });
}

export async function deleteCodeRecord(
  db: Db,
  benefitId: string,
  email: string
) {
  await db.collection(CODES).deleteOne({ benefitId, email });
}
