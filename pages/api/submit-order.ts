import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import fetch from 'node-fetch';
import {
  connectToDb,
  order as orderModel,
  store as storeModel,
  shipping as shippingModel,
  teacherAppreciation as teacherAppreciationModel,
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
    teacherAppreciationEmail?: string;
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

    // teacher appreciation verification
    const teacherAppreciationEmail = req.body.teacherAppreciationEmail ?? '';
    const teacherAppreciationId = store.teacherAppreciationId;

    let teacherAppreciation;

    if (teacherAppreciationId) {
      teacherAppreciation =
        await teacherAppreciationModel.getTeacherAppreciationById(
          db,
          teacherAppreciationId
        );
    }

    const isEligibleForTeacherAppreciation =
      !!teacherAppreciation &&
      teacherAppreciation.active &&
      teacherAppreciation.eligibleEmails.includes(teacherAppreciationEmail) &&
      !teacherAppreciation.usedEmails.includes(teacherAppreciationEmail);

    // check if the cart has a teacher appreciation item
    const cartHasTeacherAppreciationItem = req.body.items.some(item => {
      return item.itemTotal === 0 && item.quantity === 1;
    });

    const orderIncludesTeacherAppreciation =
      isEligibleForTeacherAppreciation && cartHasTeacherAppreciationItem;

    if (cartHasTeacherAppreciationItem && !isEligibleForTeacherAppreciation) {
      return res.json({
        // error: 'Teacher Appreciation email is invalid or has already been used',
        error:
          'Your email is either ineligible or has already been used for the teacher appreciation discount.',
      });
    }

    // 3. verify order items and order subtotal
    const verified = verifyCartItems(
      req.body.items,
      store.products,
      isEligibleForTeacherAppreciation
    );

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

    let stripeIntentId: string | undefined;

    if (verifiedTotal > 0) {
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

      stripeIntentId = intent.id;
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
        stripeFee:
          verifiedTotal > 0 ? Math.round(verifiedTotal * 0.029 + 30) : 0,
      },
      refund: {
        status: 'None',
        amount: 0,
      },
      stripeId: stripeIntentId,
      note: req.body.note?.trim() ?? '',
      meta: {
        receiptPrinted: false,
      },
      ...(orderIncludesTeacherAppreciation && {
        teacherAppreciation: {
          id: teacherAppreciationId,
          email: teacherAppreciationEmail,
        },
      }),
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

    // 11. if teacher appreciation was used, add email to teacher appreciation usedEmails
    if (orderIncludesTeacherAppreciation) {
      await teacherAppreciationModel.addUsedEmailToTeacherAppreciation(
        db,
        teacherAppreciationId,
        teacherAppreciationEmail
      );
    }

    res.json({
      success: true,
      orderId: order.orderId,
      resetTeacherAppreciation: !!teacherAppreciation,
    });
  } catch (error: any) {
    if (error.type === 'StripeCardError') {
      return res.json({ error: error.message });
    } else {
      return res.json({ error: error.message || 'Internal server error' });
    }
  }
};
