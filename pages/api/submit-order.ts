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
  OrderItem,
  PrimaryShippingAddress,
  ShippingMethod,
  Store,
} from '../../interfaces';
import {
  createReceiptNumber,
  removeNonDigits,
  SALES_TAX_RATE,
} from '../../utils';
import { getStoreStatus } from '../../utils/store';
import { verifyCartItems } from 'utils/payment';
import { internalHeaders, siteBaseUrl } from '../../utils/internalRequest';
import { getStoreBenefit, readMemberSession } from '../../utils/memberBenefit';
import {
  memberEligibility,
  MemberEligibility,
  usageFor,
} from '../../core/memberBenefits/eligibility';
import { MemberBenefit } from '../../core/memberBenefits/types';
import { release, reserve } from '../../core/memberBenefits/reservation';
import { PriceLine, priceOrder } from '../../core/pricing/priceOrder';
import { expectedTotalFrom } from '../../utils/checkout';

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
    // The total the browser last showed as owed. Typed unknown because it
    // arrives over the wire and is validated before it is trusted.
    expectedTotal?: unknown;
  };
}

const stripe = new Stripe(`${process.env.STRIPE_SECRET_KEY}`, {
  apiVersion: '2020-08-27',
});

const SHIPPING_METHODS: ShippingMethod[] = [
  'Primary',
  'Direct',
  'Store Pickup',
];

/**
 * Calls one of our own routes and says so loudly when it fails.
 *
 * These two used to be bare awaited fetches whose responses were dropped. The
 * payment has already gone through by the time they run, so neither should
 * fail the order — but silence is the wrong other extreme. Both endpoints now
 * refuse unsigned callers, which means a missing or mismatched
 * INTERNAL_API_SECRET in any one environment turns into orders that quietly
 * never decrement stock and never send a receipt, with the customer charged
 * and nothing anywhere saying why.
 */
async function callInternal(
  baseUrl: string,
  path: string,
  body: unknown,
  orderId: string
) {
  try {
    const response = await fetch(`${baseUrl}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...internalHeaders() },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error(
        `[order ${orderId}] ${path} responded ${response.status}.` +
          (response.status === 401
            ? ' INTERNAL_API_SECRET is missing or does not match between this' +
              ' deployment and the one API_HOST points at.'
            : '')
      );
    }
  } catch (err) {
    console.error(`[order ${orderId}] ${path} could not be reached`, err);
  }
}

// The garment and its add-ons apart, the way the pricing pipeline wants
// them. Both come from verifyCartItems, so both are the store's numbers.
function toPriceLine(item: OrderItem): PriceLine {
  return {
    id: item.id,
    unitPrice: item.price - item.personalizationTotal,
    addOnUnitPrice: item.personalizationTotal,
    quantity: item.quantity,
    productId: item.sku.storeProductId,
  };
}

// Told to the customer when their benefit no longer covers what the page
// said it would: the reservation failed, the card is missing for a total the
// browser thought was zero, or the total came out above what was displayed.
// In every case something moved between the page loading and the order
// landing, and the client re-fetches the page's props, and re-syncs the cart
// when this response carries verifiedItems, on seeing benefitChanged.
const BENEFIT_CHANGED =
  'has changed since this page loaded, so the totals have been refreshed. Please review your order and submit it again.';

// Said whenever the order came out above the total on screen. It does not
// name a benefit, because at this point the cause is genuinely unknown: a
// benefit may have been spent or paused, or an item may simply cost more
// than it did when it went into the cart. Naming the member's benefit here
// was wrong in both directions — it accused a benefit that was fine when a
// price had risen, and a member whose free item does not cover what they are
// buying was told that free item had changed. The refreshed page below the
// message shows what actually moved.
const TOTAL_CHANGED =
  'This order costs more than the total shown when the page loaded, so the totals have been refreshed. Please review your order and submit it again.';


export default async (req: ExtendedRequest, res: NextApiResponse) => {
  // Set once a member's allowance has been drawn down, so that any exit
  // before the order is saved can put it back.
  let reservation: {
    benefit: MemberBenefit;
    eligibility: MemberEligibility;
    amount: number;
    orderId: string;
  } | null = null;
  let orderSaved = false;

  const undoReservation = async (db: Parameters<typeof release>[0]) => {
    if (!reservation || orderSaved) return;
    const { benefit, eligibility, amount, orderId } = reservation;
    await release(
      db,
      benefit,
      { email: eligibility.member?.email ?? '' },
      amount,
      orderId
    );
    reservation = null;
  };

  let db: Awaited<ReturnType<typeof connectToDb>> | undefined;

  try {
    // Throws in production if neither API_HOST nor VERCEL_URL is set, which
    // is the same failure the old fixed API_HOST check caught.
    const baseUrl = siteBaseUrl(req);

    db = await connectToDb();

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

    if (!Array.isArray(req.body.items) || req.body.items.length === 0) {
      return res
        .status(400)
        .json({ error: 'An order needs at least one item' });
    }

    const shippingMethod = req.body.shippingMethod;
    if (!SHIPPING_METHODS.includes(shippingMethod)) {
      return res
        .status(400)
        .json({ error: 'A valid shipping method is required' });
    }

    // 3. verify order items against the store's own products and stock
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

    // 4. the member benefit, from the session cookie and the database only.
    // Nothing in the request body can claim one.
    const benefit = await getStoreBenefit(db, store);
    const session = benefit ? readMemberSession(req, store._id) : null;
    const eligibility =
      benefit && session && session.benefitId === benefit._id
        ? memberEligibility(benefit, session.email)
        : null;

    // 5. price it, the same way the browser just did
    const priced = priceOrder({
      lines: verified.items.map(toPriceLine),
      benefit: eligibility?.eligible ? eligibility.forPricing : null,
      taxRate: SALES_TAX_RATE,
      shipping: {
        method: shippingMethod,
        price: shipping.price,
        freeMinimum: shipping.freeMinimum,
      },
    });

    // 5a. never charge more than the shopper was looking at. The server is
    // the authority on price, and between this page loading and this request
    // landing a benefit can shrink: spent in another tab, paused from the
    // dashboard, or its amount edited. Charging the true higher total would
    // take money nobody agreed to, so stop and let them see the new number
    // first. A lower total needs no permission and goes through.
    const expectedTotal = expectedTotalFrom(req.body);

    if (expectedTotal !== null && priced.total > expectedTotal) {
      return res.json({
        error: TOTAL_CHANGED,
        benefitChanged: true,
        // The cart can be the stale half: it keeps the price each item had
        // when it was added, so a price rise since then lands here too.
        // Re-fetching the page's props would not touch it, and every retry
        // would be refused the same way. Hand back the prices the server
        // just used so the cart can catch up and the message is true.
        verifiedItems: verified.items,
      });
    }

    // 6. create orderId
    const orderId = createReceiptNumber();

    // 7. draw down the member's allowance before anything is charged. The
    // conditional update only succeeds while they still have enough, so two
    // orders racing for the same balance cannot both win.
    if (benefit && eligibility && eligibility.eligible && eligibility.member) {
      const amount = usageFor(benefit, eligibility, {
        creditApplied: priced.creditApplied,
        freeUnits: priced.adjustments.reduce(
          (sum, a) => sum + (a.kind === 'freeItem' ? a.units ?? 0 : 0),
          0
        ),
        discountApplied: priced.adjustments.reduce(
          (sum, a) => sum + (a.kind === 'discount' ? -a.amount : 0),
          0
        ),
      });

      if (amount > 0) {
        const result = await reserve(
          db,
          benefit,
          { email: eligibility.member.email, allowance: eligibility.allowance },
          amount,
          orderId
        );

        if (result !== 'reserved') {
          return res.json({
            error: `Your ${benefit.copy.benefitName} ${BENEFIT_CHANGED}`,
            benefitChanged: true,
          });
        }

        reservation = { benefit, eligibility, amount, orderId };
      }
    }

    let stripeIntentId: string | undefined;

    if (priced.total > 0) {
      // The browser only collects a card when it believes something is owed.
      // If it believed wrong, the benefit changed under it.
      if (!req.body.payment_method_id) {
        await undoReservation(db);
        return res.json({
          error: `Your ${
            benefit?.copy.benefitName ?? 'benefit'
          } ${BENEFIT_CHANGED}`,
          benefitChanged: true,
        });
      }

      // 8. send request to Stripe to handle payment
      const intent = await stripe.paymentIntents.create({
        amount: priced.total,
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
        await undoReservation(db);
        return res
          .status(500)
          .json({ error: `Unexpected status ${intent.status}` });
      }

      stripeIntentId = intent.id;
    }

    // 9. format the order for the db. Each line keeps its real unit price;
    // what a free item took off is in summary.adjustments, and the line's
    // total reflects it.
    const timestamp = new Date().toISOString();
    const items = verified.items.map(item => {
      const line = priced.lines.find(l => l.id === item.id);
      // `adjustments` on a cart item is browser display state from
      // usePricedCart, not order data; the order's own list is on summary.
      const { adjustments, ...rest } = item as typeof item & {
        adjustments?: unknown;
      };
      void adjustments;
      return { ...rest, itemTotal: line ? line.lineTotal : item.itemTotal };
    });

    const order: Order = {
      orderId,
      store: {
        id: req.body.storeId,
        name: req.body.storeName,
      },
      items,
      customer: {
        firstName: req.body.customer.firstName.trim(),
        lastName: req.body.customer.lastName.trim(),
        email: req.body.customer.email.toLowerCase().trim(),
        phone: removeNonDigits(req.body.customer.phone),
      },
      group: req.body.group,
      orderStatus: 'Unfulfilled',
      shippingMethod,
      shippingAddress: req.body.shippingAddress,
      summary: {
        subtotal: priced.subtotal,
        adjustments: priced.adjustments,
        shipping: priced.shipping,
        salesTax: priced.salesTax,
        waived: priced.waived,
        total: priced.total,
        stripeFee: priced.total > 0 ? Math.round(priced.total * 0.029 + 30) : 0,
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
      ...(reservation && {
        benefit: {
          benefitId: reservation.benefit._id,
          type: reservation.benefit.type,
          email: reservation.eligibility.member?.email ?? '',
          used: reservation.amount,
          remainingAfter: Math.max(
            0,
            reservation.eligibility.remaining - reservation.amount
          ),
        },
      }),
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    // 10. add order to the database
    await orderModel.addOrderToStore(db, store._id, order);
    orderSaved = true;

    // 11. send email receipt
    await callInternal(
      baseUrl,
      '/api/send-email-receipt',
      { order },
      order.orderId
    );

    // 12. send request to subtract inventory
    await callInternal(
      baseUrl,
      '/api/subtract-inventory',
      order.items,
      order.orderId
    );

    res.json({ success: true, orderId: order.orderId });
  } catch (error: any) {
    if (db) {
      try {
        await undoReservation(db);
      } catch (releaseError) {
        console.error('Could not release a benefit reservation', releaseError);
      }
    }

    if (error.type === 'StripeCardError') {
      return res.json({ error: error.message });
    } else {
      return res.json({ error: error.message || 'Internal server error' });
    }
  }
};
