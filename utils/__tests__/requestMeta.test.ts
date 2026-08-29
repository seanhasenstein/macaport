import { NextApiRequest } from 'next';
import { requestMeta } from '../requestMeta';

const req = (headers: Record<string, string | string[]>, remote?: string) =>
  ({ headers, socket: { remoteAddress: remote } } as unknown as NextApiRequest);

describe('the metadata kept alongside an enquiry', () => {
  it('records what the request carried', () => {
    const meta = requestMeta(
      req({
        'cf-connecting-ip': '203.0.113.4',
        'user-agent': 'Mozilla/5.0 (Macintosh)',
        referer: 'https://www.google.com/',
        'accept-language': 'en-US,en;q=0.9',
        'x-form-duration': '184000',
      })
    );

    expect(meta).toEqual({
      ip: '203.0.113.4',
      userAgent: 'Mozilla/5.0 (Macintosh)',
      referer: 'https://www.google.com/',
      acceptLanguage: 'en-US,en;q=0.9',
      durationMs: 184000,
    });
  });

  it('returns a full record when the request carried nothing', () => {
    // This runs on the path that stores a lead, and that path fails open. A
    // request with no headers worth reading should cost the fields and not the
    // enquiry, so every key still has to be there.
    const meta = requestMeta(req({}));

    expect(meta.ip).toBe('unknown');
    expect(meta.userAgent).toBe('');
    expect(meta.referer).toBe('');
    expect(meta.acceptLanguage).toBe('');
    expect(meta.durationMs).toBeNull();
  });

  it('keeps a duration that says the form was filled in too fast to be real', () => {
    // The signal the field exists for. A form with this many questions
    // answered in under two seconds was not answered by a person.
    expect(requestMeta(req({ 'x-form-duration': '1200' })).durationMs).toBe(1200);
  });

  it('drops a duration it cannot trust rather than storing it as zero', () => {
    // A zero would read back as an instant submission — the exact signal above,
    // invented out of a header that was missing or malformed.
    expect(requestMeta(req({ 'x-form-duration': 'soon' })).durationMs).toBeNull();
    expect(requestMeta(req({ 'x-form-duration': '-5' })).durationMs).toBeNull();
    expect(requestMeta(req({ 'x-form-duration': '' })).durationMs).toBeNull();
  });

  it('caps a tab left open rather than throwing the answer away', () => {
    const day = 24 * 60 * 60 * 1000;
    expect(requestMeta(req({ 'x-form-duration': '999999999' })).durationMs).toBe(
      day
    );
  });

  it('truncates a header long enough to be a payload', () => {
    const meta = requestMeta(req({ 'user-agent': 'x'.repeat(5000) }));
    expect(meta.userAgent).toHaveLength(512);
  });

  it('reads one value when a header arrives twice', () => {
    const meta = requestMeta(req({ 'accept-language': ['en-GB', 'ru-RU'] }));
    expect(meta.acceptLanguage).toBe('en-GB');
  });
});
