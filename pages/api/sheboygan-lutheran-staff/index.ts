import { NextApiResponse } from 'next';
import nc from 'next-connect';

import database from '../../../middleware/db';
import { sheboyganLutheranStaff } from '../../../db';

import { Request } from '../../../interfaces';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .get(async (req, res) => {
    const { id } = req.query;
    const result = await sheboyganLutheranStaff.getSheboyganLutheranStaffById(
      req.db,
      id
    );
    res.json(result);
  });

export default handler;
