import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { CartItem, Request } from '../../interfaces';
import database from '../../middleware/db';
import { inventoryProduct } from '../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const checkoutItems: CartItem[] = req.body;

    for (const checkoutItem of checkoutItems) {
      const inventoryProductSku = await inventoryProduct.getInventoryProductSku(
        req.db,
        checkoutItem.sku.inventoryProductId,
        checkoutItem.sku.inventorySkuId
      );

      if (inventoryProductSku) {
        const updatedInventory =
          inventoryProductSku.inventory - checkoutItem.quantity >= 0
            ? inventoryProductSku.inventory - checkoutItem.quantity
            : 0;
        await inventoryProduct.updateInventoryProductSku(
          req.db,
          checkoutItem.sku.inventoryProductId,
          inventoryProductSku.id,
          updatedInventory
        );
      }
    }

    res.json({ success: true });
  });

export default handler;
