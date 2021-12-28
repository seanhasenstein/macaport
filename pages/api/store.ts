import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../interfaces';
import database from '../../middleware/db';
import { store } from '../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const result = await store.getStoreById(req.db, req.query.id);
    res.json(result);
  });

export default handler;
