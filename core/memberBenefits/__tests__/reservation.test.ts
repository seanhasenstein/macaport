import { Db, ObjectID } from 'mongodb';
import {
  reservationFilter,
  reservationUpdate,
  releaseFilter,
  releaseUpdate,
  reserve,
  release,
} from '../reservation';

const id = new ObjectID().toHexString();

describe('the reservation condition', () => {
  it('matches only while the member still has enough left', () => {
    const filter = reservationFilter(id, 'pat@example.com', 7500, 3000);

    // used must be at most allowance - amount, so a member who has used 4500
    // of 7500 can still take 3000 and one who has used 4501 cannot.
    expect(filter.members.$elemMatch).toEqual({
      email: 'pat@example.com',
      used: { $lte: 4500 },
    });
    expect(filter.active).toBe(true);
    expect(filter._id.toHexString()).toBe(id);
  });

  it('cannot match when the amount exceeds the allowance', () => {
    const filter = reservationFilter(id, 'pat@example.com', 7500, 8000);

    expect(filter.members.$elemMatch.used.$lte).toBeLessThan(0);
  });

  it('draws down and records the order in one update', () => {
    const update = reservationUpdate(3000, '12345-67890');

    expect(update.$inc).toEqual({ 'members.$.used': 3000 });
    expect(update.$push).toEqual({ 'members.$.orderIds': '12345-67890' });
  });

  it('puts exactly what was taken back', () => {
    const update = releaseUpdate(3000, '12345-67890');

    expect(update.$inc).toEqual({ 'members.$.used': -3000 });
    expect(update.$pull).toEqual({ 'members.$.orderIds': '12345-67890' });
    expect(releaseFilter(id, 'pat@example.com').members).toEqual({
      $elemMatch: { email: 'pat@example.com' },
    });
  });
});

// A collection stand-in that answers the two calls reserve() makes.
function fakeDb(matched: number, exists: number) {
  const updateOne = jest.fn().mockResolvedValue({ matchedCount: matched });
  const countDocuments = jest.fn().mockResolvedValue(exists);
  const db = { collection: () => ({ updateOne, countDocuments }) };
  return { db: db as unknown as Db, updateOne, countDocuments };
}

describe('reserve', () => {
  const benefit = { _id: id };
  const member = { email: 'pat@example.com', allowance: 7500 };

  it('reports reserved when the conditional update matched', async () => {
    const { db, countDocuments } = fakeDb(1, 1);

    expect(await reserve(db, benefit, member, 3000, 'o1')).toBe('reserved');
    expect(countDocuments).not.toHaveBeenCalled();
  });

  it('reports insufficient when the member exists but the condition failed', async () => {
    const { db } = fakeDb(0, 1);

    expect(await reserve(db, benefit, member, 3000, 'o1')).toBe('insufficient');
  });

  it('reports notFound when no such member or benefit exists', async () => {
    const { db } = fakeDb(0, 0);

    expect(await reserve(db, benefit, member, 3000, 'o1')).toBe('notFound');
  });

  it('touches nothing for a zero amount', async () => {
    const { db, updateOne } = fakeDb(0, 0);

    expect(await reserve(db, benefit, member, 0, 'o1')).toBe('reserved');
    expect(updateOne).not.toHaveBeenCalled();
  });

  it('refuses a negative or fractional amount rather than adding balance', async () => {
    const { db } = fakeDb(1, 1);

    await expect(reserve(db, benefit, member, -100, 'o1')).rejects.toThrow();
    await expect(reserve(db, benefit, member, 1.5, 'o1')).rejects.toThrow();
  });
});

describe('release', () => {
  it('skips the write for a zero amount', async () => {
    const { db, updateOne } = fakeDb(1, 1);

    await release(db, { _id: id }, { email: 'pat@example.com' }, 0, 'o1');
    expect(updateOne).not.toHaveBeenCalled();
  });

  it('writes the reversal otherwise', async () => {
    const { db, updateOne } = fakeDb(1, 1);

    await release(db, { _id: id }, { email: 'pat@example.com' }, 3000, 'o1');
    expect(updateOne).toHaveBeenCalledTimes(1);
  });
});
