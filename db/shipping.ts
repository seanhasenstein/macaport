import { Db } from 'mongodb';
import { ShippingData } from '../interfaces';

export async function getShippingDetails(db: Db) {
  const result = await db.collection<ShippingData>('shipping').findOne({});

  if (!result) {
    throw new Error('Failed to find the shipping data');
  }

  return { ...result, _id: `${result._id}` };
}
