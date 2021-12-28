import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import fetch from 'node-fetch';
import { connectToDb, store } from '../../db';
import { CartItem, Order, Product } from '../../interfaces/';
import {
  calculateSalesTax,
  calculateCartTotal,
  createReceiptNumber,
  removeNonDigits,
} from '../../utils';

type CartAccumulator = {
  verifiedItems: CartItem[];
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
  if (intent.status === 'succeeded') {
    const data = {
      ...order,
      stripeId: intent.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const res = await fetch(`${process.env.API_HOST}/api/add-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    await fetch(`${process.env.API_HOST}/api/email-receipt`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ store: result, orderId: order.orderId }),
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

    // go get the products from the db
    const { db } = await connectToDb();
    const { products }: { products: Product[] } = await store.getStoreById(
      db,
      storeId
    );

    // 1. verify order items and order subtotal
    const { verifiedItems, verifiedSubtotal } = items.reduce(
      (cartAccumulator: CartAccumulator, currentItem: CartItem) => {
        const product = products.find(p => p.id === currentItem.sku.productId);

        // if item was in the cart but no longer exists in db store.products
        // then don't add the product to the verified items and return
        if (!product)
          return {
            verifiedItems: cartAccumulator.verifiedItems,
            verifiedSubtotal: cartAccumulator.verifiedSubtotal,
          };

        const item = product.skus.find(s => s.id === currentItem.sku.id);

        if (item) {
          const itemPrice =
            item.size.price +
            (currentItem.customName ? 500 : 0) +
            (currentItem.customNumber ? 500 : 0);

          const verifiedItem = {
            ...currentItem,
            price: itemPrice,
            itemTotal: itemPrice * currentItem.quantity!,
          };

          const verifiedSubtotal =
            cartAccumulator.verifiedSubtotal + verifiedItem.itemTotal;

          return {
            verifiedItems: [...cartAccumulator.verifiedItems, verifiedItem],
            verifiedSubtotal,
          };
        }
      },
      { verifiedItems: [], verifiedSubtotal: 0 }
    );

    // 2. calculate order salesTax and total from verified items and subtotal
    const verifiedSalesTax = calculateSalesTax(verifiedSubtotal);
    const verifiedTotal = calculateCartTotal(
      verifiedSubtotal,
      verifiedSalesTax
    );

    // 2.5 create orderId
    const orderId = createReceiptNumber();

    // 3. send req to Stripe to handle payment
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

    // 4. handle stripe payment response
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
      },
    });
  } catch (error: any) {
    if (error.type === 'StripeCardError') {
      // display error on client
      return res.json({ error: error.message });
    } else {
      // something else happened
      return res.status(500).json({ error: error.type });
    }
  }
};
