import { Db, ObjectID } from 'mongodb';
import { InventoryProduct, Store, StoreProduct } from '../interfaces';

export async function getStoreById(db: Db, id: string) {
  const store: Store | null = await db
    .collection('stores')
    .findOne(
      { _id: new ObjectID(id) },
      { projection: { contact: 0, orders: 0, notes: 0 } }
    );

  if (!store) {
    throw new Error('No store found.');
  }

  let storeProducts: StoreProduct[] = [];

  for (let i = 0; i < store.products.length; i++) {
    const inventoryProduct: InventoryProduct = await db
      .collection('inventoryProducts')
      .findOne({ inventoryProductId: store.products[i].inventoryProductId });

    const productSkus = store.products[i].productSkus.map(s => {
      const inventoryProductSku = inventoryProduct.skus.find(
        ips => ips.id === s.inventorySkuId
      );
      const inventory = inventoryProductSku?.inventory || 0;
      const active = (s.active && inventoryProductSku?.active) || false;
      return { ...s, inventory, active };
    });

    const storeProduct = { ...store.products[i], productSkus };
    const outOfStock = storeProduct.productSkus.every(ps => ps.inventory === 0);

    if (!outOfStock) {
      storeProducts = [...storeProducts, storeProduct];
    }
  }

  const result = {
    ...store,
    _id: `${store._id}`,
    products: storeProducts,
  };

  return result;
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
    .project({ orders: 0, contact: 0, notes: 0 })
    .toArray();
  return await result;
}
