import { Db, ObjectID } from 'mongodb';
import { Order, Store } from '../interfaces';

export async function getOrderFromStore(
  db: Db,
  storeId: string,
  orderId: string
) {
  try {
    const result: Store = await db
      .collection('stores')
      .findOne({ _id: new ObjectID(storeId) });
    if (!result) {
      throw new Error('Invalid Store ID provided.');
    }
    const order = result.orders.find(o => o.orderId === orderId);
    if (!order) {
      throw new Error(`Order not found.`);
    }
    return {
      order,
      groupRequired: result.requireGroupSelection,
      groupTerm: result.groupTerm,
    };
  } catch (error) {
    console.error(error);
    throw new Error(error.message);
  }
}

export async function addOrderToStore(db: Db, storeId: string, order: Order) {
  try {
    const result = await db
      .collection('stores')
      .findOneAndUpdate(
        { _id: new ObjectID(storeId) },
        { $push: { orders: order } },
        { returnDocument: 'after', upsert: true }
      );
    return result.value;
  } catch (error) {
    console.error(error);
    throw new Error('An error occurred adding the order to the store.');
  }
}
