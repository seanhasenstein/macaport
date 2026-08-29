import { NextApiRequest } from 'next';

type Window = { count: number; resetAt: number };

// Per-process, which is the honest limitation: on a serverless host each
// instance keeps its own counter, so a determined attacker spread across warm
// instances gets more through than the number below suggests. It still turns
// "unlimited mail from one script" into "a trickle", which is the difference
// that matters. A shared store is the upgrade if this ever needs to be exact.
const windows = new Map<string, Window>();

// Bounded so a flood of unique keys cannot grow the map without limit. Expired
// entries are dropped first; the map is only cleared outright if every entry is
// somehow still live, which costs a few callers their count rather than memory.
const MAX_KEYS = 10_000;

function prune(now: number) {
  // forEach rather than for..of: this compiles to ES5, where iterating a Map
  // directly needs downlevelIteration. Keys are collected first because
  // deleting from the map being walked is asking for trouble.
  const expired: string[] = [];
  windows.forEach((window, key) => {
    if (now > window.resetAt) expired.push(key);
  });
  expired.forEach(key => windows.delete(key));

  if (windows.size > MAX_KEYS) windows.clear();
}

export function rateLimit({
  key,
  limit,
  windowMs,
  now = Date.now(),
}: {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
}) {
  if (windows.size > MAX_KEYS / 2) prune(now);

  const current = windows.get(key);

  if (!current || now > current.resetAt) {
    windows.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  current.count += 1;

  return {
    allowed: current.count <= limit,
    retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}

// Exported because utils/requestMeta reads the same way — a header that came
// through twice is a list, and an empty one should read as absent rather than
// as an empty string that later gets stored.
export const requestHeader = (req: NextApiRequest, name: string) => {
  const value = req.headers[name];
  return (Array.isArray(value) ? value[0] : value)?.trim() || undefined;
};

/**
 * Best available client address.
 *
 * Order matters. The headers tried first are written by the edge itself and
 * cannot be set by the caller, so they are worth trusting. x-forwarded-for is
 * last and is only a fallback: it is a list the client starts and each proxy
 * appends to, so its leftmost entry — the one everyone reaches for — is
 * whatever the caller decided to send. Reading that would let anyone rotate a
 * header and walk straight past every limit keyed on this.
 *
 * The last entry is the address the nearest proxy actually observed, which is
 * the closest thing to a fact when nothing better is available.
 */
export function clientIp(req: NextApiRequest) {
  const trusted =
    requestHeader(req, 'cf-connecting-ip') ??
    requestHeader(req, 'x-vercel-forwarded-for') ??
    requestHeader(req, 'x-real-ip');

  if (trusted) return trusted;

  const forwarded = requestHeader(req, 'x-forwarded-for');
  const hops = forwarded?.split(',').map(hop => hop.trim()).filter(Boolean);
  const nearest = hops?.[hops.length - 1];

  return nearest || req.socket?.remoteAddress || 'unknown';
}

// Exported for tests. Nothing else should need it.
export function resetRateLimits() {
  windows.clear();
}
