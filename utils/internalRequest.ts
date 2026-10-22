import * as crypto from 'crypto';
import { IncomingHttpHeaders } from 'http';
import { NextApiRequest } from 'next';

/**
 * Where this deployment can reach itself, for the server-to-server calls
 * submit-order makes and for the links in emails.
 *
 * In production it is API_HOST, the public domain, so receipt links read
 * macaport.com and not a deployment hash; on a preview deployment, where
 * API_HOST should be left unset, it is the preview's own VERCEL_URL, so a
 * preview calls itself rather than production. The request's Host header is
 * only consulted outside production: it is whatever the client sent, and a
 * call carrying INTERNAL_API_SECRET must not be pointed at an address the
 * client chose. Locally that means the port `next dev` actually started on,
 * whatever it is, with no env var to keep in step.
 */
export function siteBaseUrl(req?: { headers: IncomingHttpHeaders }) {
  const configured = process.env.API_HOST?.replace(/\/$/, '');
  const vercel = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

  if (process.env.NODE_ENV === 'production') {
    const url = configured || vercel;
    if (!url) {
      throw new Error('API_HOST (or VERCEL_URL) is required in production');
    }
    return url;
  }

  const host = req?.headers.host;
  if (host) {
    const proto =
      req?.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http';
    return `${proto}://${host}`;
  }

  return configured || vercel || 'http://localhost:3000';
}

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
