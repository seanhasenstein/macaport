import { isAllowlisted, resolveRecipient, describeDelivery } from '../mailgun';

const env = process.env;

beforeEach(() => {
  process.env = { ...env };
  delete process.env.VERCEL_ENV;
  delete process.env.EMAIL_ALLOWLIST;
  delete process.env.EMAIL_REDIRECT_TO;
});

afterAll(() => {
  process.env = env;
});

describe('the outbound email guard', () => {
  it('matches exact addresses and whole domains, case-insensitively', () => {
    const list = ' Pat@Example.com, @macaport.com ';

    expect(isAllowlisted('pat@example.com', list)).toBe(true);
    expect(isAllowlisted('PAT@EXAMPLE.COM', list)).toBe(true);
    expect(isAllowlisted('nick@Macaport.com', list)).toBe(true);
    expect(isAllowlisted('other@example.com', list)).toBe(false);
    expect(isAllowlisted('nick@notmacaport.com', list)).toBe(false);
    expect(isAllowlisted('anyone@example.com', undefined)).toBe(false);
  });

  it('delivers to anyone in production', () => {
    process.env.VERCEL_ENV = 'production';

    expect(resolveRecipient('customer@example.com')).toEqual({
      to: 'customer@example.com',
      redirected: false,
    });
  });

  it('delivers to an allowlisted address outside production', () => {
    process.env.EMAIL_ALLOWLIST = '@macaport.com';

    expect(resolveRecipient('nick@macaport.com')).toEqual({
      to: 'nick@macaport.com',
      redirected: false,
    });
  });

  it('redirects everyone else to the test inbox', () => {
    process.env.EMAIL_ALLOWLIST = '@macaport.com';
    process.env.EMAIL_REDIRECT_TO = 'tester@macaport.com';

    expect(resolveRecipient('customer@example.com')).toEqual({
      to: 'tester@macaport.com',
      redirected: true,
    });
  });

  it('does not call mail for the test inbox itself a redirect', () => {
    process.env.EMAIL_ALLOWLIST = '@macaport.com';
    process.env.EMAIL_REDIRECT_TO = 'Tester@Example.com';

    expect(resolveRecipient('tester@example.com')).toEqual({
      to: 'tester@example.com',
      redirected: false,
    });
  });

  it('refuses rather than guesses when there is nowhere to redirect', () => {
    process.env.EMAIL_ALLOWLIST = '@macaport.com';

    expect(() => resolveRecipient('customer@example.com')).toThrow(
      /EMAIL_REDIRECT_TO/
    );
    expect(describeDelivery('customer@example.com')).toEqual({
      deliveredTo: null,
      redirected: true,
    });
  });

  it('treats a preview deployment as not production', () => {
    process.env.VERCEL_ENV = 'preview';
    process.env.EMAIL_REDIRECT_TO = 'tester@macaport.com';

    expect(resolveRecipient('customer@example.com').redirected).toBe(true);
  });
});
