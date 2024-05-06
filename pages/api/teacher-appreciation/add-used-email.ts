import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { Request } from '../../../interfaces';
import database from '../../../middleware/db';
import { teacherAppreciation } from '../../../db';

const handler = nc<Request, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { id } = req.query;
    const updatedTeacherAppreciation =
      await teacherAppreciation.addUsedEmailToTeacherAppreciation(
        req.db,
        id,
        req.body.email
      );
    res.json(updatedTeacherAppreciation);
  });

export default handler;
