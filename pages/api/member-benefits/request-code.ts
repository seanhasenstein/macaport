import { NextApiResponse } from 'next';
import nc from 'next-connect';

import database from '../../../middleware/db';
import {
  store as storeModel,
  memberBenefit as benefitModel,
} from '../../../db';
import {
  memberEligibility,
  normalizeEmail,
} from '../../../core/memberBenefits/eligibility';
import { requestCode } from '../../../core/verification/code';
import { codeEmail } from '../../../core/verification/email';
import { sendEmail } from '../../../utils/mailgun';
import { wrapCodeEmail } from '../../../utils/email';
import { clientIp, rateLimit } from '../../../utils/rateLimit';
import { memberBenefitSecret } from '../../../utils/memberBenefit';
import { Request } from '../../../interfaces';

interface ExtendedRequest extends Request {
  body: {
    storeId?: unknown;
    email?: unknown;
  };
}

// Per address and per email. The address limit stops one machine walking a
// list of guesses; the email limit stops anyone flooding one inbox. Both are
// generous for a person, who needs at most a few tries.
const IP_LIMIT = 20;
const EMAIL_LIMIT = 6;
const WINDOW_MS = 10 * 60 * 1000;

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Asks for a sign-in code to be emailed to a member.
//
// An email that is not on the list is told so straight away rather than
// being sent nothing. Membership of a company store is not a secret worth
// the confusion of a blind "check your inbox" when nothing is coming, and
// the rate limits above cover anyone trying to enumerate the list.
const handler = nc<ExtendedRequest, NextApiResponse>()
  .use(database)
  .post(async (req, res) => {
    const { storeId, email: rawEmail } = req.body ?? {};

    if (typeof storeId !== 'string' || typeof rawEmail !== 'string') {
      return res
        .status(400)
        .json({ error: 'A store and an email are required' });
    }

    const email = normalizeEmail(rawEmail);
    if (!EMAIL_SHAPE.test(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    const byIp = rateLimit({
      key: `benefit-code-ip:${clientIp(req)}`,
      limit: IP_LIMIT,
      windowMs: WINDOW_MS,
    });
    const byEmail = rateLimit({
      key: `benefit-code-email:${email}`,
      limit: EMAIL_LIMIT,
      windowMs: WINDOW_MS,
    });

    if (!byIp.allowed || !byEmail.allowed) {
      const retry = Math.max(byIp.retryAfterSeconds, byEmail.retryAfterSeconds);
      res.setHeader('Retry-After', String(retry));
      return res.status(429).json({ error: 'Too many requests' });
    }

    const store = await storeModel.getStoreSummary(req.db, storeId);
    const benefit = store?.benefitId
      ? await benefitModel.getMemberBenefitById(req.db, store.benefitId)
      : null;

    if (!store || !benefit) {
      return res
        .status(404)
        .json({ error: 'This store has no member benefit' });
    }

    const eligibility = memberEligibility(benefit, email);
    if (eligibility.reason === 'notMember') {
      return res.json({ status: 'notMember' });
    }

    const now = Date.now();
    const existing = await benefitModel.getCodeRecord(
      req.db,
      benefit._id,
      email
    );
    const request = requestCode(existing, {
      benefitId: benefit._id,
      email,
      secret: memberBenefitSecret(),
      now,
    });

    if (request.kind === 'cooldown') {
      return res.json({
        status: 'cooldown',
        retryAfterSeconds: Math.ceil(request.retryAfterMs / 1000),
      });
    }

    await benefitModel.saveCodeRecord(req.db, request.record);

    const message = codeEmail({
      code: request.code,
      storeName: store.name,
      benefitName: benefit.copy.benefitName,
      expiresAt: request.record.expiresAt,
      resent: request.resent,
      sender: 'Macaport',
    });

    const delivery = await sendEmail({
      to: email,
      from: 'Macaport <support@macaport.com>',
      subject: message.subject,
      text: message.text,
      html: wrapCodeEmail({
        subject: message.subject,
        code: request.code,
        body: message.html,
        storeName: store.name,
      }),
    });

    res.json({
      status: 'sent',
      resent: request.resent,
      expiresAt: request.record.expiresAt,
      // Outside production the guard in utils/mailgun may have sent this
      // somewhere else; the card says so rather than leaving a tester to
      // wonder why nothing arrived.
      deliveredTo: delivery.deliveredTo,
      redirected: delivery.redirected,
    });
  });

export default handler;
