import { Db, ObjectID } from 'mongodb';

export async function getStoreById(db: Db, id: string) {
  try {
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
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred querying for the store.');
  }
}

export async function getStores(db: Db, filter: Record<string, unknown> = {}) {
  try {
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
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred querying for the stores.');
  }
}
