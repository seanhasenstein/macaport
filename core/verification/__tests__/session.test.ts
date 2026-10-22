import {
  signSession,
  verifySession,
  sessionCookie,
  clearedSessionCookie,
  sessionCookieName,
  MemberSession,
} from '../session';

const secret = 'test-secret';
const session: MemberSession = {
  benefitId: 'b1',
  email: 'pat@example.com',
  exp: 1_000_000,
};

describe('member session token', () => {
  it('round-trips', () => {
    const token = signSession(session, secret);

    expect(verifySession(token, secret, 999_999)).toEqual(session);
  });

  it('is rejected once expired', () => {
    const token = signSession(session, secret);

    expect(verifySession(token, secret, 1_000_000)).toBeNull();
  });

  it('is rejected if any byte of the payload changed', () => {
    const token = signSession(session, secret);
    const [payload, signature] = token.split('.');
    const forged = Buffer.from(
      JSON.stringify({ ...session, email: 'mallory@example.com' })
    ).toString('base64url');

    expect(verifySession(`${forged}.${signature}`, secret, 0)).toBeNull();
    expect(verifySession(`${payload}.${signature}x`, secret, 0)).toBeNull();
    expect(verifySession(payload, secret, 0)).toBeNull();
    expect(verifySession('', secret, 0)).toBeNull();
    expect(verifySession(undefined, secret, 0)).toBeNull();
  });

  it('is rejected under a different secret', () => {
    const token = signSession(session, secret);

    expect(verifySession(token, 'rotated', 0)).toBeNull();
  });

  it('refuses a validly signed payload of the wrong shape', () => {
    const token = signSession({ benefitId: 'b1' } as MemberSession, secret);

    expect(verifySession(token, secret, 0)).toBeNull();
  });
});

describe('the cookie', () => {
  it('is per store, httpOnly, site-wide and secure in production', () => {
    const cookie = sessionCookie('store1', 'tok.sig', {
      maxAgeMs: 90_000,
      secure: true,
    });

    expect(sessionCookieName('store1')).toBe('mb_store1');
    expect(cookie).toBe(
      'mb_store1=tok.sig; Path=/; Max-Age=90; HttpOnly; SameSite=Lax; Secure'
    );
  });

  it('is not marked secure in development, where there is no https', () => {
    const cookie = sessionCookie('store1', 'tok.sig', {
      maxAgeMs: 90_000,
      secure: false,
    });

    expect(cookie).not.toContain('Secure');
  });

  it('clears with a zero max age', () => {
    expect(clearedSessionCookie('store1', true)).toBe(
      'mb_store1=; Path=/; Max-Age=0; HttpOnly; SameSite=Lax; Secure'
    );
  });
});
