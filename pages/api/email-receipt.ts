import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { sendEmail } from '../../utils/mailgun';
import { generateReceiptEmail } from '../../utils/email';
import { Store } from '../../interfaces';

interface Request extends NextApiRequest {
  body: {
    store: Store;
    orderId: string;
  };
}

const handler = nc<Request, NextApiResponse>().post(async (req, res) => {
  const order = req.body.store.orders.find(o => o.orderId === req.body.orderId);
  if (!order) {
    throw new Error(`No order found with ID ${req.body.orderId}`);
  }
  const { text, html } = generateReceiptEmail(order);

  const result = await sendEmail({
    to: order.customer.email,
    from: `Macaport Demo Store <nick@macaport.com>`,
    subject: `Apparel Order [#${req.body.orderId}]`,
    text,
    html,
  });

  console.log(result);

  res.send({ success: true });
});

export default handler;
