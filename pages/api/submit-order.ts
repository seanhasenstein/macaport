import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import fetch from 'node-fetch';
import {
  connectToDb,
  order as orderModel,
  store as storeModel,
  shipping as shippingModel,
} from '../../db';
import {
  Address,
  CartItem,
  Order,
  PrimaryShippingAddress,
  ShippingMethod,
  Store,
} from '../../interfaces';
import {
  calculateSalesTax,
  calculateCartTotal,
  createReceiptNumber,
  calculateShipping,
  removeNonDigits,
} from '../../utils';
import { getStoreStatus } from '../../utils/store';
import { verifyCartItems } from 'utils/payment';

interface ExtendedRequest extends NextApiRequest {
  body: {
    storeId: string;
    storeName: string;
    payment_method_id: string;
    items: CartItem[];
    customer: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
    group: string;
    shippingMethod: ShippingMethod;
    shippingAddress: Address | PrimaryShippingAddress;
    note?: string;
  };
}

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
});

export default async (req: ExtendedRequest, res: NextApiResponse) => {
  try {
    if (!process.env.API_HOST) {
      throw new Error('Environment variable API_HOST is required');
    }

    const db = await connectToDb();
    // 1. get store from db to verify items
    const store: Store | undefined = await storeModel.getStoreById(
      db,
      req.body.storeId
    );

    // get the shipping data
    const shipping = await shippingModel.getShippingDetails(db);

    if (!store) {
      return res.json({ storeClosed: true });
    }

    // 2. verify that the store is open
    const isStoreOpen = getStoreStatus(store.openDate, store.closeDate);

    if (isStoreOpen === false) {
      return res.json({ storeClosed: true });
    }

    // 3. verify order items and order subtotal
    const verified = verifyCartItems(req.body.items, store.products);

    // send response back if theres not enough inventory for all cartItems with this sku.id
    if (
      verified.lowerInventoryItems.length > 0 ||
      verified.itemsOutOfStock.length > 0
    ) {
      return res.json({
        lowerInventory: verified.lowerInventoryItems.length > 0,
        lowerInventoryItems: verified.lowerInventoryItems,
        outOfStock: verified.itemsOutOfStock.length > 0,
        outOfStockItems: verified.itemsOutOfStock,
        verifiedItems: verified.items,
      });
    }

    // 4. calculate order salesTax and total from verified items and subtotal
    const verifiedSalesTax = calculateSalesTax(verified.subtotal);
    const verifiedShipping = calculateShipping(
      shipping.price,
      shipping.freeMinimum,
      verified.subtotal,
      req.body.shippingMethod
    );
    const verifiedTotal = calculateCartTotal(
      verified.subtotal,
      verifiedSalesTax,
      verifiedShipping
    );

    // 5. create orderId
    const orderId = createReceiptNumber();

    // 6. send request to Stripe to handle payment
    const intent = await stripe.paymentIntents.create({
      amount: verifiedTotal,
      currency: 'usd',
      payment_method: req.body.payment_method_id,
      confirm: true,
      error_on_requires_action: true,
      metadata: {
        orderId,
        storeId: req.body.storeId,
        store: req.body.storeName,
      },
    });

    if (intent.status !== 'succeeded') {
      return res
        .status(500)
        .json({ error: `Unexpected status ${intent.status}` });
    }

    // 7. format the order for the db
    const timestamp = new Date().toISOString();
    const order: Order = {
      orderId,
      store: {
        id: req.body.storeId,
        name: req.body.storeName,
      },
      items: verified.items,
      customer: {
        firstName: req.body.customer.firstName.trim(),
        lastName: req.body.customer.lastName.trim(),
        email: req.body.customer.email.toLowerCase().trim(),
        phone: removeNonDigits(req.body.customer.phone),
      },
      group: req.body.group,
      orderStatus: 'Unfulfilled',
      shippingMethod: req.body.shippingMethod,
      shippingAddress: req.body.shippingAddress,
      summary: {
        subtotal: verified.subtotal,
        shipping: verifiedShipping,
        salesTax: verifiedSalesTax,
        total: verifiedTotal,
        stripeFee: Math.round(verifiedTotal * 0.029 + 30),
      },
      refund: {
        status: 'None',
        amount: 0,
      },
      stripeId: intent.id,
      note: req.body.note?.trim() ?? '',
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // 8. add order to the database
    await orderModel.addOrderToStore(db, store._id, order);

    // 9. send email receipt
    await fetch(`${process.env.API_HOST}/api/send-email-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order }),
    });

    // 10. send request to subtract inventory
    await fetch(`${process.env.API_HOST}/api/subtract-inventory`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order.items),
    });

    res.json({ success: true, orderId: order.orderId });
  } catch (error: any) {
    if (error.type === 'StripeCardError') {
      return res.json({ error: error.message });
    } else {
      return res.json({ error: error.message || 'Internal server error' });
    }
  }
};
