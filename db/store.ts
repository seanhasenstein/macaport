import { Db, ObjectID } from 'mongodb';
import {
  InventoryProduct,
  ProductColor,
  Store,
  StoreProduct,
} from '../interfaces';

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
      return {
        ...s,
        inventoryProductId: inventoryProduct.inventoryProductId,
        inventory,
        active,
      };
    });

    const activeProductSkus = productSkus.filter(s => s.active);

    const storeProduct = {
      ...store.products[i],
      productSkus: activeProductSkus,
    };

    const includedColors = storeProduct.colors.reduce(
      (accumulator: ProductColor[], currentColor) => {
        const productHasSkuWithColor = storeProduct.productSkus.some(
          ps => ps.color.id === currentColor.id
        );

        if (productHasSkuWithColor) {
          return [...accumulator, currentColor];
        }

        return accumulator;
      },
      []
    );

    const storeProductResult = { ...storeProduct, colors: includedColors };

    storeProducts = [...storeProducts, storeProductResult];
  }

  const { orders, contact, notes, ...result } = {
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
