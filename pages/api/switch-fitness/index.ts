import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../../interfaces';
import database from '../../../middleware/db';
import { switchFitness } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const { id } = req.query;
    const result = await switchFitness.getSwitchFitnessDiscountById(req.db, id);
    res.json(result);
  });

export default handler;
