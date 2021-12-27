import { Db, ObjectID } from 'mongodb';

export async function getStoreById(db: Db, id: string) {
  const result = await db
    .collection('stores')
    .aggregate([
      {
        $match: { _id: new ObjectID(id) },
      },
      {
        $set: {
          _id: { $toString: '$_id' },
        },
      },
    ])
    .toArray();

  return result[0];
}

export async function getStores(db: Db, filter: Record<string, unknown> = {}) {
  const result = await db
    .collection('stores')
    .aggregate([
      {
        $match: { ...filter },
      },
      {
        $set: {
          _id: { $toString: '$_id' },
        },
      },
    ])
    .toArray();
  return await result;
}
