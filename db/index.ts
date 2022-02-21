import { mongoClientPromise } from './connect';
import * as inventoryProduct from './inventoryProduct';
import * as order from './order';
import * as store from './store';

async function connectToDb() {
  const client = await mongoClientPromise;
  return client.db();
}

export { connectToDb, inventoryProduct, order, store };
