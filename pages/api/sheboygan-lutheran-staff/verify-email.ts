import { NextApiResponse } from 'next';
import nc from 'next-connect';

import database from '../../../middleware/db';
import { sheboyganLutheranStaff } from '../../../db';

import { Request } from '../../../interfaces';

interface ExtendedRequest extends Request {
  body: {
    id: string;
    email: string;
  };
}

const handler = nc<ExtendedRequest, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const { id, email } = req.query as { id: string; email: string };

    if (!id || !email) {
      return res.status(400).json({ error: 'Missing id or email' });
    }

    const { isEligible, alreadyUsed } =
      await sheboyganLutheranStaff.verifySheboyganLutheranStaffEligibility(
        req.db,
        id,
        email
      );

    res.json({ isEligible, alreadyUsed });
  });

export default handler;
