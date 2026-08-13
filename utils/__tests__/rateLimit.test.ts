import { rateLimit, clientIp, resetRateLimits } from '../rateLimit';
import { NextApiRequest } from 'next';

beforeEach(() => resetRateLimits());

const call = (key: string, now: number) =>
  rateLimit({ key, limit: 3, windowMs: 60_000, now });

describe('rate limit', () => {
  it('allows up to the limit and refuses after it', () => {
    expect(call('a', 0).allowed).toBe(true);
    expect(call('a', 1).allowed).toBe(true);
    expect(call('a', 2).allowed).toBe(true);
    expect(call('a', 3).allowed).toBe(false);
  });

  it('counts each caller separately', () => {
    call('a', 0);
    call('a', 0);
    call('a', 0);

    expect(call('a', 0).allowed).toBe(false);
    expect(call('b', 0).allowed).toBe(true);
  });

  it('lets them back in once the window passes', () => {
    call('a', 0);
    call('a', 0);
    call('a', 0);
    expect(call('a', 0).allowed).toBe(false);

    expect(call('a', 60_001).allowed).toBe(true);
  });

  it('says how long to wait', () => {
    call('a', 0);
    call('a', 0);
    call('a', 0);

    const refused = call('a', 30_000);
    expect(refused.allowed).toBe(false);
    expect(refused.retryAfterSeconds).toBe(30);
  });
});

describe('client ip', () => {
  const req = (headers: Record<string, string | string[]>, remote?: string) =>
    ({ headers, socket: { remoteAddress: remote } } as unknown as NextApiRequest);

  it('takes the client from the front of x-forwarded-for', () => {
    expect(clientIp(req({ 'x-forwarded-for': '203.0.113.4, 70.41.3.18' }))).toBe(
      '203.0.113.4'
    );
  });

  it('falls back to the socket when unproxied', () => {
    expect(clientIp(req({}, '198.51.100.7'))).toBe('198.51.100.7');
  });

  it('never returns empty, so one key cannot become every caller', () => {
    expect(clientIp(req({ 'x-forwarded-for': '  ' }))).toBe('unknown');
  });
});
