import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../../interfaces';
import database from '../../../middleware/db';
import { teacherAppreciation } from '../../../db';

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
    const {
      isEligible,
      alreadyUsed,
      paused,
      email: normalizedEmail,
    } = await teacherAppreciation.verifyTeacherAppreciationEmailEligibility(
      req.db,
      id,
      email
    );
    res.json({ isEligible, alreadyUsed, paused, email: normalizedEmail });
  });

export default handler;
