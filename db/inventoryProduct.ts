import { Db } from 'mongodb';
import { InventoryProduct } from '../interfaces';

export async function getInventoryProductSku(
  db: Db,
  inventoryProductId: string,
  inventorySkuId: string
) {
  const result: InventoryProduct = await db
    .collection('inventoryProducts')
    .findOne({ inventoryProductId });

  return result.skus.find(s => s.id === inventorySkuId);
}

export async function updateInventoryProduct(
  db: Db,
  inventoryProductId: string,
  inventorySkuId: string,
  updatedInventory: number
) {
  const result = await db
    .collection('inventoryProducts')
    .updateOne(
      { inventoryProductId },
      { $set: { 'skus.$[sku].inventory': updatedInventory } },
      { arrayFilters: [{ 'sku.id': { $eq: inventorySkuId } }] }
    );
  return result;
}
