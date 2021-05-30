import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';
import { sendEmail } from '../../utils/mailgun';
import { generateReceiptEmail } from '../../utils/email';
import { Order } from '../../interfaces';

interface Request extends NextApiRequest {
  body: Order;
}

const handler = nc<Request, NextApiResponse>().post(async (req, res) => {
  try {
    const { text, html } = generateReceiptEmail(req.body);

    await sendEmail({
      to: req.body.customer.email,
      from: `Macaport Demo Store <nick@macaport.com>`,
      subject: `Apparel Order [#${req.body.orderId}]`,
      text,
      html,
    });

    res.send({ success: true });
  } catch (error) {
    console.error(error);
    res.json({ error: error.message });
  }
});

export default handler;
