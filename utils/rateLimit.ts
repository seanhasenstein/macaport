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

// x-forwarded-for is a list, client first, appended to by each proxy. The
// socket address alone would be the proxy's on any real deployment.
export function clientIp(req: NextApiRequest) {
  const header = req.headers['x-forwarded-for'];
  const raw = Array.isArray(header) ? header[0] : header;
  const first = raw?.split(',')[0]?.trim();

  return first || req.socket?.remoteAddress || 'unknown';
}

// Exported for tests. Nothing else should need it.
export function resetRateLimits() {
  windows.clear();
}
