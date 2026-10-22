import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { clearedSessionCookie } from '../../../core/verification/session';
import { secureCookies } from '../../../utils/memberBenefit';

interface ExtendedRequest extends NextApiRequest {
  body: { storeId?: unknown };
}

// "Use a different email". Clears this store's session cookie and nothing
// else: a session in another store stays.
const handler = nc<ExtendedRequest, NextApiResponse>().post((req, res) => {
  const { storeId } = req.body ?? {};

  if (typeof storeId !== 'string' || !storeId) {
    return res.status(400).json({ error: 'A store is required' });
  }

  res.setHeader('Set-Cookie', clearedSessionCookie(storeId, secureCookies()));
  res.json({ status: 'ok' });
});

export default handler;
