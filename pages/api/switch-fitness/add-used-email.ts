import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../../interfaces';
import database from '../../../middleware/db';
import { switchFitness } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { id } = req.query;
    const updatedSwitchFitnessDiscount =
      await switchFitness.addUsedEmailToSwitchFitness(
        req.db,
        id,
        req.body.email
      );
    res.json(updatedSwitchFitnessDiscount);
  });

export default handler;
