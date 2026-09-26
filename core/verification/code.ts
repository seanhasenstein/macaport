// Emailed one-time codes for proving you own a member's email.
//
// The code is never stored. It is derived from a secret and a per-request
// nonce, so a copy of the database cannot be used to sign in as anyone, and
// yet a resend can send the same six digits again. That second property is
// the point: when someone taps "resend" twice because mail is slow, every
// copy that arrives carries the same code, and there is no "older one" to
// type by mistake. A new code is only minted once the old one has expired or
// been locked out.
//
// Pure. The caller owns storage and the clock.

import * as crypto from 'crypto';

// Ten minutes is the usual ceiling for a delivered code, and shorter mostly
// punishes slow mail rather than attackers.
export const CODE_TTL_MS = 10 * 60 * 1000;
// Five wrong guesses against a six-digit code is a 1 in 200,000 chance.
export const MAX_ATTEMPTS = 5;
// Blunts the double tap without making "I mistyped my email" a wait.
export const RESEND_COOLDOWN_MS = 30 * 1000;

export interface CodeRecord {
  benefitId: string;
  email: string;
  // What the code is derived from. Random, single use.
  nonce: string;
  createdAt: number;
  expiresAt: number;
  // Wrong guesses so far.
  attempts: number;
  lastSentAt: number;
  sendCount: number;
}

export function codeFor(record: CodeRecord, secret: string) {
  const digest = crypto
    .createHmac('sha256', secret)
    .update(`${record.benefitId}:${record.email}:${record.nonce}`)
    .digest();
  // Six digits from the first four bytes. 2^32 mod 10^6 is 967,296, so the
  // bias toward low codes is a few parts in a million: not worth rejection
  // sampling for.
  const n = digest.readUInt32BE(0) % 1_000_000;
  return String(n).padStart(6, '0');
}

export type CodeRequest =
  | { kind: 'cooldown'; retryAfterMs: number }
  | { kind: 'send'; record: CodeRecord; code: string; resent: boolean };

// Decide what a request for a code should do, given what is already
// outstanding for this email.
export function requestCode(
  existing: CodeRecord | null,
  input: { benefitId: string; email: string; secret: string; now: number },
  nonce: string = crypto.randomBytes(16).toString('hex')
): CodeRequest {
  const { now } = input;
  const live =
    existing &&
    existing.expiresAt > now &&
    existing.attempts < MAX_ATTEMPTS &&
    existing.benefitId === input.benefitId &&
    existing.email === input.email;

  if (live && existing) {
    const since = now - existing.lastSentAt;
    if (since < RESEND_COOLDOWN_MS) {
      return { kind: 'cooldown', retryAfterMs: RESEND_COOLDOWN_MS - since };
    }
    const record = {
      ...existing,
      lastSentAt: now,
      sendCount: existing.sendCount + 1,
    };
    return {
      kind: 'send',
      record,
      code: codeFor(record, input.secret),
      resent: true,
    };
  }

  const record: CodeRecord = {
    benefitId: input.benefitId,
    email: input.email,
    nonce,
    createdAt: now,
    expiresAt: now + CODE_TTL_MS,
    attempts: 0,
    lastSentAt: now,
    sendCount: 1,
  };
  return {
    kind: 'send',
    record,
    code: codeFor(record, input.secret),
    resent: false,
  };
}

export type CodeCheck = 'ok' | 'expired' | 'lockedOut' | 'wrong';

// The caller records a wrong guess by incrementing attempts and stores that,
// and deletes the record on ok. Comparing in constant time is cheap and
// stops a timing side channel, however unlikely one is over email.
export function checkCode(
  record: CodeRecord | null,
  submitted: string,
  secret: string,
  now: number
): CodeCheck {
  if (!record || record.expiresAt <= now) return 'expired';
  if (record.attempts >= MAX_ATTEMPTS) return 'lockedOut';

  const expected = Buffer.from(codeFor(record, secret));
  const given = Buffer.from(normalizeCode(submitted));
  if (given.length !== expected.length) return 'wrong';

  return crypto.timingSafeEqual(given, expected) ? 'ok' : 'wrong';
}

// People type "123 456" and "123-456". Only the digits matter.
export function normalizeCode(input: string) {
  return (input || '').replace(/\D/g, '');
}
