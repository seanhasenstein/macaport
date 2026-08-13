import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { sendEmail } from '../../utils/mailgun';
import { generateReceiptEmail } from '../../utils/email';
import { isInternalRequest } from '../../utils/internalRequest';
import { clientIp, rateLimit } from '../../utils/rateLimit';
import { Order } from '../../interfaces';

interface Request extends NextApiRequest {
  body: {
    order: Order;
  };
}

// Only reached by an unsigned caller, which in normal operation is nobody:
// submit-order is the one legitimate caller and it signs its requests.
const LIMIT = 10;
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

  // Signed calls skip the ceiling. A store launch can put dozens of orders
  // through in minutes, and they all arrive from the same server address, so
  // throttling by IP would drop real receipts on exactly the busiest day.
  if (internal === null) {
    const limit = rateLimit({
      key: clientIp(req),
      limit: LIMIT,
      windowMs: WINDOW_MS,
    });

    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSeconds));
      return res.status(429).json({ error: 'Too many requests' });
    }
  }

  if (!looksLikeOrder(req.body?.order)) {
    return res.status(400).json({ error: 'A valid order is required' });
  }

  const order = req.body.order;
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
