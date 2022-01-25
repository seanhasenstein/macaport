import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { CartItem, Request } from '../../interfaces';
import database from '../../middleware/db';
import { inventoryProduct } from '../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const checkoutItems: CartItem[] = req.body;

    checkoutItems.forEach(async item => {
      const inventoryProductSku = await inventoryProduct.getInventoryProductSku(
        req.db,
        item.sku.inventoryProductId,
        item.sku.inventorySkuId
      );

      if (inventoryProductSku) {
        const updatedInventory =
          inventoryProductSku.inventory - item.quantity >= 0
            ? inventoryProductSku.inventory - item.quantity
            : 0;
        await inventoryProduct.updateInventoryProduct(
          req.db,
          item.sku.inventoryProductId,
          inventoryProductSku.id,
          updatedInventory
        );
      }
    });

    res.json({ success: true });
  });

export default handler;
