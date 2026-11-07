// Drawing down a member's allowance without double-spending it.
//
// The old programs pushed the email onto a used list after the card had been
// charged and the order saved. Two tabs submitting together both passed the
// check and both got the benefit. This reserves first, with a single
// conditional update that only matches while the member still has enough,
// and Mongo applies one such update at a time to a document. The loser of a
// race sees `insufficient` and the customer is told before their card is
// touched. If the charge then fails, `release` puts it back.
//
// The filter and update are built by pure functions so the exact condition
// is testable without a database.

import { Db, ObjectID } from 'mongodb';
import { MemberBenefit } from './types';

const COLLECTION = 'memberBenefits';

export type ReservationResult = 'reserved' | 'insufficient' | 'notFound';

// Matches only while `used + amount <= allowance` for this member, and only
// while the benefit is switched on. `allowance` is read by the caller from
// the document it already has: an admin changing it in the same instant is
// harmless, because the thing that prevents a double spend is `used`, and
// that is compared atomically here.
export function reservationFilter(
  benefitId: string,
  email: string,
  allowance: number,
  amount: number
) {
  return {
    _id: new ObjectID(benefitId),
    active: true,
    members: {
      $elemMatch: { email, used: { $lte: allowance - amount } },
    },
  };
}

export function reservationUpdate(amount: number, orderId: string) {
  return {
    $inc: { 'members.$.used': amount },
    $push: { 'members.$.orderIds': orderId },
    $set: { updatedAt: new Date().toISOString() },
  };
}

export function releaseFilter(benefitId: string, email: string) {
  return {
    _id: new ObjectID(benefitId),
    members: { $elemMatch: { email } },
  };
}

export function releaseUpdate(amount: number, orderId: string) {
  return {
    $inc: { 'members.$.used': -amount },
    $pull: { 'members.$.orderIds': orderId },
    $set: { updatedAt: new Date().toISOString() },
  };
}

export async function reserve(
  db: Db,
  benefit: Pick<MemberBenefit, '_id'>,
  member: { email: string; allowance: number },
  amount: number,
  orderId: string
): Promise<ReservationResult> {
  if (!Number.isInteger(amount) || amount < 0) {
    throw new Error(`reserve amount must be a non-negative integer`);
  }
  if (amount === 0) return 'reserved';

  const result = await db
    .collection(COLLECTION)
    .updateOne(
      reservationFilter(benefit._id, member.email, member.allowance, amount),
      reservationUpdate(amount, orderId)
    );

  if (result.matchedCount === 1) return 'reserved';

  // Nothing matched: either the member has less than `amount` left, or the
  // benefit or member does not exist (or was paused). Tell them apart so the
  // customer gets the right message.
  const exists = await db.collection(COLLECTION).countDocuments(
    {
      _id: new ObjectID(benefit._id),
      members: { $elemMatch: { email: member.email } },
    },
    { limit: 1 }
  );

  return exists ? 'insufficient' : 'notFound';
}

export async function release(
  db: Db,
  benefit: Pick<MemberBenefit, '_id'>,
  member: { email: string },
  amount: number,
  orderId: string
) {
  if (amount === 0) return;

  await db
    .collection(COLLECTION)
    .updateOne(
      releaseFilter(benefit._id, member.email),
      releaseUpdate(amount, orderId)
    );
}
