import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import fetch from 'node-fetch';
import { connectToDb, store } from '../../db';
import {
  CartItem,
  Order,
  OrderItem,
  Store as StoreInterface,
} from '../../interfaces/';
import {
  calculateSalesTax,
  calculateCartTotal,
  createReceiptNumber,
  removeNonDigits,
  isStoreActive,
} from '../../utils';

type CartAccumulator = {
  verifiedItems: OrderItem[];
  lowerInventoryItems: CartItem[];
  itemsOutOfStock: CartItem[];
  verifiedSubtotal: number;
};

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
});

async function generateResponse(
  response: NextApiResponse,
  intent: Stripe.Response<Stripe.PaymentIntent>,
  order: Order
) {
  // if Stripe payment succeeded...
  if (intent.status === 'succeeded') {
    const data = {
      ...order,
      stripeId: intent.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // send data to api route to add the order to the db
    const addToOrderResponse = await fetch(
      `${process.env.API_HOST}/api/add-order`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }
    );

    const result = await addToOrderResponse.json();

    // send email receipt
    await fetch(`${process.env.API_HOST}/api/email-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store: result, orderId: order.orderId }),
    });

    // send a request to db to subtract verifiedItem.quantity
    // from inventoryProduct.inventory
    await fetch(`${process.env.API_HOST}/api/subtract-inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order.items),
    });

    return response.json({ success: true, orderId: order.orderId });
  } else {
    // any other status would be unexpected, so send as error
    return response
      .status(500)
      .json({ error: `Unexpected status ${intent.status}` });
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const {
      storeId,
      storeName,
      payment_method_id,
      items,
      customer,
      group,
      shippingMethod,
      shippingAddress,
      summary,
    } = req.body;

    const { db } = await connectToDb();
    const { products, openDate, closeDate }: StoreInterface =
      await store.getStoreById(db, storeId);

    // 1. verify that the store is open
    const isStoreOpen = isStoreActive(openDate, closeDate);

    if (isStoreOpen === false) {
      return res.json({ storeClosed: true });
    }

    // 2. verify order items and order subtotal
    const {
      lowerInventoryItems,
      verifiedItems,
      itemsOutOfStock,
      verifiedSubtotal,
    }: CartAccumulator = items.reduce(
      (cartAccumulator: CartAccumulator, currentItem: CartItem) => {
        const product = products.find(
          p => p.id === currentItem.sku.storeProductId
        );
        const productSku = product?.productSkus.find(
          ps => ps.id === currentItem.sku.id
        );

        if (!product || !productSku) {
          return {
            ...cartAccumulator,
            itemsOutOfStock: [
              ...cartAccumulator.itemsOutOfStock,
              { ...currentItem, quantity: 0, itemTotal: 0 },
            ],
          };
        }

        const verifiedItems = cartAccumulator.verifiedItems.filter(
          vi => vi.sku.id === currentItem.sku.id
        );
        const totalQuantity = verifiedItems.reduce(
          (total, currentVerifiedItem) => currentVerifiedItem.quantity + total,
          currentItem.quantity
        );

        if (productSku.inventory < totalQuantity) {
          if (productSku.inventory === 0) {
            return {
              ...cartAccumulator,
              itemsOutOfStock: [
                ...cartAccumulator.itemsOutOfStock,
                { ...currentItem, quantity: 0, itemTotal: 0 },
              ],
            };
          }

          const updatedQuantity = totalQuantity - productSku.inventory;

          return {
            ...cartAccumulator,
            lowerInventoryItems: [
              ...cartAccumulator.lowerInventoryItems,
              {
                ...currentItem,
                quantity: updatedQuantity,
                itemTotal:
                  updatedQuantity * currentItem.price +
                  (currentItem.customName ? 500 : 0) +
                  (currentItem.customNumber ? 500 : 0),
              },
            ],
          };
        }

        const itemPrice =
          productSku.size.price +
          (currentItem.customName ? 500 : 0) +
          (currentItem.customNumber ? 500 : 0);

        const { active, inventory, ...updatedSku } = currentItem.sku;

        const verifiedItem = {
          ...currentItem,
          sku: updatedSku,
          merchandiseCode: product.merchandiseCode,
          price: itemPrice,
          itemTotal: itemPrice * currentItem.quantity!,
        };

        const verifiedSubtotal =
          cartAccumulator.verifiedSubtotal + verifiedItem.itemTotal;

        return {
          ...cartAccumulator,
          verifiedItems: [...cartAccumulator.verifiedItems, verifiedItem],
          verifiedSubtotal,
        };
      },
      {
        verifiedItems: [],
        lowerInventoryItems: [],
        itemsOutOfStock: [],
        verifiedSubtotal: 0,
      }
    );

    // send response to customer if
    // 1. any cartItem quantity is > db inventory or
    // 2. if any items are out of stock
    if (lowerInventoryItems.length > 0 || itemsOutOfStock.length > 0) {
      return res.json({
        lowerInventory: lowerInventoryItems.length > 0,
        lowerInventoryItems,
        outOfStock: itemsOutOfStock.length > 0,
        outOfStockItems: itemsOutOfStock,
        verifiedItems,
      });
    }

    // 3. calculate order salesTax and total from verified items and subtotal
    const verifiedSalesTax = calculateSalesTax(verifiedSubtotal);
    const verifiedTotal = calculateCartTotal(
      verifiedSubtotal,
      verifiedSalesTax
    );

    // 4. create orderId
    const orderId = createReceiptNumber();

    // 5. send req to Stripe to handle payment
    const intent = await stripe.paymentIntents.create({
      amount: verifiedTotal,
      currency: 'usd',
      payment_method: payment_method_id,
      confirm: true,
      error_on_requires_action: true,
      metadata: {
        orderId,
        storeId,
        store: storeName,
      },
    });

    // ***********************************************
    // const orderItems = verifiedItems.map(vi => {
    //   const { active, inventory, ...sku } = vi.sku;
    //   return { ...vi, sku };
    // });

    // 6. handle stripe payment response
    return generateResponse(res, intent, {
      orderId,
      store: {
        id: storeId,
        name: storeName,
      },
      items: verifiedItems,
      customer: {
        firstName: customer.firstName.trim(),
        lastName: customer.lastName.trim(),
        email: customer.email.toLowerCase().trim(),
        phone: removeNonDigits(customer.phone),
      },
      group,
      orderStatus: 'Unfulfilled',
      shippingMethod,
      shippingAddress,
      summary: {
        subtotal: verifiedSubtotal,
        shipping: summary.shipping,
        salesTax: verifiedSalesTax,
        total: verifiedTotal,
        stripeFee: Math.round(verifiedTotal * 0.029 + 30),
      },
      refund: {
        status: 'None',
        amount: 0,
      },
    });
  } catch (error: any) {
    if (error.type === 'StripeCardError') {
      return res.json({ error: error.message });
    } else {
      return res.status(500).json({ error: error.type });
    }
  }
};
