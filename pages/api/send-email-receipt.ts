import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { sendEmail } from '../../utils/mailgun';
import { generateReceiptEmail } from '../../utils/email';
import { isInternalRequest } from '../../utils/internalRequest';
import { rateLimit } from '../../utils/rateLimit';
import { Order } from '../../interfaces';

interface Request extends NextApiRequest {
  body: {
    order: Order;
  };
}

// Per recipient, and only reached by an unsigned caller. A customer receiving
// more than a handful of receipts inside ten minutes is not a customer.
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

// Enough to know the body is an order rather than something shaped to get text
// delivered to an address of the caller's choosing. Not a full schema: this is
// built by submit-order from data already in the database, so the goal is to
// reject the forged, not to re-check our own writes.
function looksLikeOrder(order: Order | undefined) {
  if (!order || typeof order !== 'object') return false;

  return (
    isNonEmptyString(order.orderId) &&
    isNonEmptyString(order.customer?.email) &&
    isNonEmptyString(order.store?.id) &&
    isNonEmptyString(order.store?.name) &&
    typeof order.summary?.total === 'number'
  );
}

const handler = nc<Request, NextApiResponse>().post(async (req, res) => {
  // null means INTERNAL_API_SECRET is not configured yet. Treated as unknown
  // rather than as a rejection, so turning this on cannot stop real customers
  // getting receipts before the variable is set. Once it is set, an unsigned
  // request is a forgery and is refused outright.
  const internal = isInternalRequest(req);

  if (internal === false) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!looksLikeOrder(req.body?.order)) {
    return res.status(400).json({ error: 'A valid order is required' });
  }

  const order = req.body.order;

  // Keyed on who the receipt is going to, not on who asked for it to be sent.
  // Every legitimate call arrives from the same server address, so an IP key
  // would throttle a store launch — dozens of real orders in minutes — and drop
  // receipts on the busiest day of that store's life. A recipient key cannot do
  // that, because each of those orders belongs to a different customer, while
  // still stopping anyone using this to mail the same person over and over.
  if (internal === null) {
    const limit = rateLimit({
      key: `receipt:${order.customer.email.trim().toLowerCase()}`,
      limit: LIMIT,
      windowMs: WINDOW_MS,
    });

    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSeconds));
      return res.status(429).json({ error: 'Too many requests' });
    }
  }
  const { text, html } = generateReceiptEmail(order);

  const result = await sendEmail({
    to: order.customer.email,
    from: `Macaport <support@macaport.com>`,
    subject: `Apparel Order [#${order.orderId}]`,
    text,
    html,
  });

  res.send(result);
});

export default handler;
