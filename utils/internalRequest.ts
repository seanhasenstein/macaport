import * as crypto from 'crypto';
import { NextApiRequest } from 'next';

export const INTERNAL_HEADER = 'x-macaport-internal';

const digest = (value: string) =>
  crypto.createHash('sha256').update(value).digest();

/**
 * Whether this request came from one of Macaport's own API routes.
 *
 * Returns null when INTERNAL_API_SECRET is not set, which callers must treat as
 * "unknown" rather than "no". These endpoints are called server to server by
 * routes that are already live, so a deploy that started rejecting unsigned
 * requests before the variable was configured would stop real customers getting
 * their receipts. Unknown means fall back to the public path: validate, throttle
 * and still deliver.
 */
export function isInternalRequest(req: NextApiRequest) {
  const secret = process.env.INTERNAL_API_SECRET;
  if (!secret) return null;

  const header = req.headers[INTERNAL_HEADER];
  const provided = Array.isArray(header) ? header[0] : header;
  if (!provided) return false;

  // Hashed first so both sides are the same length, which timingSafeEqual
  // requires and which also keeps the comparison from leaking the length.
  return crypto.timingSafeEqual(digest(provided), digest(secret));
}

// Headers for an outgoing call to one of our own routes. Omits the header
// entirely when unconfigured, so nothing sends the string "undefined".
export function internalHeaders(): Record<string, string> {
  const secret = process.env.INTERNAL_API_SECRET;

  return secret ? { [INTERNAL_HEADER]: secret } : {};
}
