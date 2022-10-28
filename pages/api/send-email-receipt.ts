import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { sendEmail } from '../../utils/mailgun';
import { generateReceiptEmail } from '../../utils/email';
import { Order } from '../../interfaces';

interface Request extends NextApiRequest {
  body: {
    order: Order;
  };
}

const handler = nc<Request, NextApiResponse>().post(async (req, res) => {
  if (!req.body.order) {
    throw new Error(`An order is required from the request body.`);
  }

  const { text, html } = generateReceiptEmail(req.body.order);

  const result = await sendEmail({
    to: req.body.order.customer.email,
    from: `Macaport <support@macaport.com>`,
    subject: `Apparel Order [#${req.body.order.orderId}]`,
    text,
    html,
  });

  res.send(result);
});

export default handler;
