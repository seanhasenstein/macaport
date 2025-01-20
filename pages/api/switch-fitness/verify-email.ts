import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../../interfaces';
import database from '../../../middleware/db';
import { switchFitness } from '../../../db';

interface ExtendedRequest extends Request {
  body: {
    id: string;
    email: string;
  };
}

const handler = nc<ExtendedRequest, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { id, email } = req.body;
    const { isEligible, alreadyUsed } =
      await switchFitness.verifySwitchFitnessEmailEligibility(
        req.db,
        id,
        email
      );
    res.json({ isEligible, alreadyUsed });
  });

export default handler;
