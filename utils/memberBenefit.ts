import { Db } from 'mongodb';
import { IncomingMessage } from 'http';

import { memberBenefit as memberBenefitModel } from '../db';
import { memberEligibility } from '../core/memberBenefits/eligibility';
import { MemberBenefit } from '../core/memberBenefits/types';
import {
  MemberSession,
  sessionCookieName,
  verifySession,
} from '../core/verification/session';
import { BenefitView } from '../interfaces';

// The glue between the surviving modules under core/ and this app: where the
// secret comes from, how a request turns into a verified member, and what a
// page gets told. Everything here is this repo's business and is expected to
// be rewritten at the port; everything it calls is not.

// Signs member sessions and derives one-time codes. Required as soon as any
// store has a benefit. Rotating it signs everyone out and voids codes in
// flight, which is the correct effect of rotating it.
export function memberBenefitSecret() {
  const secret = process.env.MEMBER_BENEFIT_SECRET;
  if (!secret) {
    throw new Error('Environment variable MEMBER_BENEFIT_SECRET is required');
  }
  return secret;
}

// Vercel terminates TLS, so production is always https and the cookie can be
// marked Secure. Development is plain http on localhost, where a Secure
// cookie would never be sent back.
export const secureCookies = () => process.env.NODE_ENV === 'production';

type RequestWithCookies = IncomingMessage & {
  cookies: Partial<Record<string, string>>;
};

export function readMemberSession(
  req: RequestWithCookies,
  storeId: string,
  now = Date.now()
): MemberSession | null {
  const token = req.cookies[sessionCookieName(storeId)];
  if (!token) return null;

  return verifySession(token, memberBenefitSecret(), now);
}

export async function getStoreBenefit(
  db: Db,
  store: { benefitId?: string | null }
) {
  if (!store.benefitId) return null;
  return memberBenefitModel.getMemberBenefitById(db, store.benefitId);
}

// What a store page needs to know: the benefit's copy and type, and, if this
// browser has proved it owns a member's email, that member's standing. A
// session for a different benefit, or for an email since removed from the
// list, counts as not signed in.
export function benefitViewFor(
  benefit: MemberBenefit | null,
  session: MemberSession | null
): BenefitView | null {
  if (!benefit) return null;

  let member: BenefitView['member'] = null;

  if (session && session.benefitId === benefit._id) {
    const eligibility = memberEligibility(benefit, session.email);
    if (eligibility.member) {
      member = {
        email: eligibility.member.email,
        firstName: eligibility.member.firstName ?? null,
        lastName: eligibility.member.lastName ?? null,
        reason: eligibility.reason,
        allowance: eligibility.allowance,
        used: eligibility.used,
        remaining: eligibility.remaining,
        forPricing: eligibility.forPricing,
      };
    }
  }

  return {
    id: benefit._id,
    type: benefit.type,
    access: benefit.access,
    active: benefit.active,
    copy: benefit.copy,
    productIds: benefit.productIds ?? null,
    member,
  };
}

export async function getBenefitView(
  db: Db,
  store: { _id: string; benefitId?: string | null },
  req: RequestWithCookies
) {
  const benefit = await getStoreBenefit(db, store);
  if (!benefit) return null;

  return benefitViewFor(benefit, readMemberSession(req, store._id));
}
