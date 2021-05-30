import { Db } from 'mongodb';
import { Order } from '../interfaces';

export async function addOrder(db: Db, order: Order) {
  try {
    const result = await db.collection('orders').insertOne(order);

    return result.ops[0];
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while creating the order.');
  }
}

export async function getOrder(db: Db, id: string) {
  try {
    const result = await db.collection('orders').findOne({ orderId: id });

    if (!result) throw new Error('Invalid order # provided.');

    return {
      ...result,
      _id: result._id.toString(),
      createdAt: result.createdAt.toString(),
      updatedAt: result.updatedAt.toString(),
    };
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred while querying for the order.');
  }
}
