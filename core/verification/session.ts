// The signed cookie that says "this browser proved it owns this member's
// email for this benefit".
//
// It replaces three localStorage contexts whose contents the server had to
// re-check on every submit and could never trust. A signed token is checked
// on the server on every page and every order, and cannot be produced by a
// browser. Being httpOnly, it also is not readable by page scripts.
//
// The token is base64url(JSON payload) + '.' + base64url(HMAC-SHA256). No
// library, because the whole format is nine lines and one fewer dependency
// is one fewer thing to port.

import * as crypto from 'crypto';

export interface MemberSession {
  benefitId: string;
  email: string;
  // Unix milliseconds.
  exp: number;
}

// Long enough that a member never signs in twice during a store's run, and
// the store's own close date ends it in practice.
export const SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const encode = (input: string | Buffer) =>
  Buffer.from(input).toString('base64url');

const sign = (payload: string, secret: string) =>
  crypto.createHmac('sha256', secret).update(payload).digest('base64url');

export function signSession(session: MemberSession, secret: string) {
  const payload = encode(JSON.stringify(session));
  return `${payload}.${sign(payload, secret)}`;
}

export function verifySession(
  token: string | undefined,
  secret: string,
  now: number
): MemberSession | null {
  if (!token) return null;

  const dot = token.indexOf('.');
  if (dot === -1) return null;

  const payload = token.slice(0, dot);
  const signature = token.slice(dot + 1);
  const expected = sign(payload, secret);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  let session: MemberSession;
  try {
    session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
  } catch {
    return null;
  }

  if (
    typeof session.benefitId !== 'string' ||
    typeof session.email !== 'string' ||
    typeof session.exp !== 'number' ||
    session.exp <= now
  ) {
    return null;
  }

  return session;
}

// One cookie per store, so a customer verified in two stores at once holds
// two, and clearing one does not sign them out of the other.
export function sessionCookieName(storeId: string) {
  return `mb_${storeId}`;
}

// Path is / rather than /store/<id> because the order is submitted to
// /api/submit-order, and a cookie scoped to the store's pages would not be
// sent there. The per-store name keeps them apart instead.
export function sessionCookie(
  storeId: string,
  token: string,
  options: { maxAgeMs: number; secure: boolean }
) {
  return serializeCookie(sessionCookieName(storeId), token, {
    maxAge: Math.floor(options.maxAgeMs / 1000),
    secure: options.secure,
  });
}

export function clearedSessionCookie(storeId: string, secure: boolean) {
  return serializeCookie(sessionCookieName(storeId), '', {
    maxAge: 0,
    secure,
  });
}

function serializeCookie(
  name: string,
  value: string,
  options: { maxAge: number; secure: boolean }
) {
  const parts = [
    `${name}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${options.maxAge}`,
    'HttpOnly',
    'SameSite=Lax',
  ];
  if (options.secure) parts.push('Secure');
  return parts.join('; ');
}
