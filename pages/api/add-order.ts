import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../interfaces/api';
import { Order } from '../../interfaces';
import database from '../../middleware/db';
import { order } from '../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    try {
      const result: Order = await order.addOrder(req.db, req.body);
      res.json(result);
    } catch (error) {
      console.error(error);
      res.json({ error: error.message });
    }
  });

export default handler;
