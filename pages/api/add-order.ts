import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../interfaces';
import database from '../../middleware/db';
import { order } from '../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const result = await order.addOrderToStore(
        req.db,
        req.body.store.id,
        req.body
      );

      res.json(result);
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });

export default handler;
