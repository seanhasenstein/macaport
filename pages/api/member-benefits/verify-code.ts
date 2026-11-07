import { NextApiResponse } from 'next';
import nc from 'next-connect';

import database from '../../../middleware/db';
import { store as storeModel, memberBenefit as benefitModel } from '../../../db';
import { normalizeEmail } from '../../../core/memberBenefits/eligibility';
import { checkCode, MAX_ATTEMPTS } from '../../../core/verification/code';
import {
  sessionCookie,
  signSession,
  SESSION_TTL_MS,
} from '../../../core/verification/session';
import { clientIp, rateLimit } from '../../../utils/rateLimit';
import {
  memberBenefitSecret,
  secureCookies,
} from '../../../utils/memberBenefit';
import { Request } from '../../../interfaces';

interface ExtendedRequest extends Request {
  body: {
    storeId?: unknown;
    email?: unknown;
    code?: unknown;
  };
}

// Attempts are already capped per code. This only stops a script hammering
// the endpoint across many emails from one address.
const IP_LIMIT = 30;
const WINDOW_MS = 10 * 60 * 1000;

// Turns a correct code into a signed session cookie for this store.
const handler = nc<ExtendedRequest, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { storeId, email: rawEmail, code } = req.body ?? {};

    if (
      typeof storeId !== 'string' ||
      typeof rawEmail !== 'string' ||
      typeof code !== 'string'
    ) {
      return res
        .status(400)
        .json({ error: 'A store, an email and a code are required' });
    }

    const limit = rateLimit({
      key: `benefit-verify-ip:${clientIp(req)}`,
      limit: IP_LIMIT,
      windowMs: WINDOW_MS,
    });

    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSeconds));
      return res.status(429).json({ error: 'Too many requests' });
    }

    const email = normalizeEmail(rawEmail);
    const store = await storeModel.getStoreSummary(req.db, storeId);
    const benefit = store?.benefitId
      ? await benefitModel.getMemberBenefitById(req.db, store.benefitId)
      : null;

    if (!store || !benefit) {
      return res.status(404).json({ error: 'This store has no member benefit' });
    }

    const secret = memberBenefitSecret();
    const now = Date.now();
    const record = await benefitModel.getCodeRecord(req.db, benefit._id, email);
    const check = checkCode(record, code, secret, now);

    if (check === 'wrong' && record) {
      await benefitModel.recordWrongAttempt(req.db, benefit._id, email);
      const attemptsLeft = MAX_ATTEMPTS - (record.attempts + 1);
      return res.json(
        attemptsLeft > 0
          ? { status: 'wrong', attemptsLeft }
          : { status: 'lockedOut' }
      );
    }

    if (check !== 'ok') {
      return res.json({ status: check });
    }

    await benefitModel.deleteCodeRecord(req.db, benefit._id, email);

    const token = signSession(
      { benefitId: benefit._id, email, exp: now + SESSION_TTL_MS },
      secret
    );

    res.setHeader(
      'Set-Cookie',
      sessionCookie(store._id, token, {
        maxAgeMs: SESSION_TTL_MS,
        secure: secureCookies(),
      })
    );

    res.json({ status: 'ok' });
  });

export default handler;
