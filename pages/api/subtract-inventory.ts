import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { CartItem, Request } from '../../interfaces';
import database from '../../middleware/db';
import { inventoryProduct } from '../../db';
import { isInternalRequest } from '../../utils/internalRequest';
import { clientIp, rateLimit } from '../../utils/rateLimit';
import { looksLikeCheckoutItems } from '../../utils/inventory';

// Only reachable by an unsigned caller, which in normal operation is nobody.
const LIMIT = 20;
const WINDOW_MS = 10 * 60 * 1000;

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    // This route writes stock straight to the database with nothing to undo it.
    // Unsigned, it let anyone empty every store's inventory — which reads as
    // products quietly going out of stock rather than as an attack — or, with a
    // negative quantity, inflate it and cause overselling.
    //
    // null means INTERNAL_API_SECRET is not configured yet, and is treated as
    // unknown rather than as a rejection so that deploying this cannot break
    // checkout before the variable is set.
    const internal = isInternalRequest(req);

    if (internal === false) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (internal === null) {
      const limit = rateLimit({
        key: `inventory:${clientIp(req)}`,
        limit: LIMIT,
        windowMs: WINDOW_MS,
      });

      if (!limit.allowed) {
        res.setHeader('Retry-After', String(limit.retryAfterSeconds));
        return res.status(429).json({ error: 'Too many requests' });
      }
    }

    if (!looksLikeCheckoutItems(req.body)) {
      return res.status(400).json({ error: 'Valid checkout items are required' });
    }

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
