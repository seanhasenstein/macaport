import { NextApiRequest } from 'next';

import { ContactRequestMeta } from 'interfaces';
import { clientIp, requestHeader } from './rateLimit';

// Long enough for anything genuine and short enough that a header cannot be
// used to push an arbitrary payload into a stored record. The user agent is the
// only one of these that legitimately runs long, and 512 clears every real
// browser with room to spare.
const MAX_LENGTH = 512;

const truncate = (value: string | undefined) => (value ?? '').slice(0, MAX_LENGTH);

// Anything unparseable is dropped rather than stored as a zero, which would
// read back as an instant submission that never actually happened — the exact
// signal this field exists to carry, invented out of a missing header.
function durationMs(raw: string | undefined) {
  if (!raw) return null;

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed < 0) return null;

  // A tab left open over a long weekend says nothing about anyone. Capped
  // rather than discarded, so the record still reads as "a long time" instead
  // of losing the answer altogether.
  return Math.min(Math.round(parsed), 24 * 60 * 60 * 1000);
}

/**
 * What the request carried, for telling a real enquiry from a fabricated one.
 *
 * Everything here comes from headers rather than the body, so the form cannot
 * decide what gets stored about it. The one exception is the duration, which
 * has nowhere else to come from; ContactRequestMeta.durationMs says what that
 * is worth.
 *
 * Never throws and never returns null. This runs on the path that records a
 * lead, and that path fails open by design — a header that isn't there should
 * cost a field, not the enquiry.
 */
export function requestMeta(req: NextApiRequest): ContactRequestMeta {
  return {
    ip: clientIp(req),
    userAgent: truncate(requestHeader(req, 'user-agent')),
    referer: truncate(requestHeader(req, 'referer')),
    acceptLanguage: truncate(requestHeader(req, 'accept-language')),
    durationMs: durationMs(requestHeader(req, 'x-form-duration')),
  };
}
