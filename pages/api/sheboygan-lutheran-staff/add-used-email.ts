import { NextApiResponse } from 'next';
import nc from 'next-connect';

import database from '../../../middleware/db';
import { sheboyganLutheranStaff } from '../../../db';

import { Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { id } = req.query;
    const updatedSheboyganLutheranStaff =
      await sheboyganLutheranStaff.addUsedEmailToSheboyganLutheranStaff(
        req.db,
        id,
        req.body.email
      );
    res.json(updatedSheboyganLutheranStaff);
  });

export default handler;
