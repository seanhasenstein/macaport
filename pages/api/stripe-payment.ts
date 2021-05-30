import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import fetch from 'node-fetch';
import { products } from '../../data';
import { CartItem, Order } from '../../interfaces/';
import {
  calculateCartTotal,
  calculateTransactionFee,
  createReceiptNumber,
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
      body: JSON.stringify(result),
    });

    return response.json({ success: true, orderId: result.orderId });
  } else {
    // any other status would be unexpected, so send as error
    return response
      .status(500)
      .json({ error: `Unexpected status ${intent.status}` });
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { payment_method_id, items, customer, summary } = req.body;

    // 1. verify order items and order subtotal
    const { verifiedItems, verifiedSubtotal } = items.reduce(
      (cartAccumulator: CartAccumulator, currentItem: CartItem) => {
        const item = products.find(p => p.id === currentItem.productId);

        if (item) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { skus, ...verifiedItem } = {
            ...currentItem,
            price: item.price,
            itemTotal: item.price * currentItem.quantity!,
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

    // 2. calculate order total from verified items and subtotal
    const verifiedTotal = calculateCartTotal(
      verifiedSubtotal,
      calculateTransactionFee(verifiedSubtotal)
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
      },
    });

    // 4. handle stripe payment response
    return generateResponse(res, intent, {
      orderId,
      items: verifiedItems,
      customer,
      summary,
    });
  } catch (e) {
    if (e.type === 'StripeCardError') {
      // display error on client
      return res.json({ error: e.message });
    } else {
      // something else happened
      return res.status(500).json({ error: e.type });
    }
  }
};
