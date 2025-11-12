import { mongoClientPromise } from './connect';
import * as inventoryProduct from './inventoryProduct';
import * as order from './order';
import * as shipping from './shipping';
import * as store from './store';
import * as sheboyganLutheranStaff from './sheboyganLutheranStaff';
import * as switchFitness from './switchFitness';
import * as teacherAppreciation from './teacherAppreciation';

async function connectToDb() {
  const client = await mongoClientPromise;
  return client.db();
}

export {
  connectToDb,
  inventoryProduct,
  order,
  shipping,
  store,
  sheboyganLutheranStaff,
  switchFitness,
  teacherAppreciation,
};
