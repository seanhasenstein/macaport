import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../interfaces';
import database from '../../middleware/db';
import { order } from '../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const result = await order.addOrderToStore(
      req.db,
      req.body.store.id,
      req.body
    );

    res.json(result);
  });

export default handler;
