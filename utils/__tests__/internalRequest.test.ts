import { NextApiRequest } from 'next';
import {
  INTERNAL_HEADER,
  internalHeaders,
  isInternalRequest,
} from '../internalRequest';

const req = (headers: Record<string, string> = {}) =>
  ({ headers } as unknown as NextApiRequest);

const original = process.env.INTERNAL_API_SECRET;
afterEach(() => {
  if (original === undefined) delete process.env.INTERNAL_API_SECRET;
  else process.env.INTERNAL_API_SECRET = original;
});

describe('internal request', () => {
  it('is unknown, not refused, while the secret is unconfigured', () => {
    delete process.env.INTERNAL_API_SECRET;

    // Deploying this must not start rejecting the live caller before the
    // variable is set, so callers fall back to the public path.
    expect(isInternalRequest(req())).toBeNull();
    expect(internalHeaders()).toEqual({});
  });

  it('recognises a correctly signed request', () => {
    process.env.INTERNAL_API_SECRET = 'a-real-secret';

    expect(isInternalRequest(req({ [INTERNAL_HEADER]: 'a-real-secret' }))).toBe(
      true
    );
  });

  it('refuses a wrong or missing signature once configured', () => {
    process.env.INTERNAL_API_SECRET = 'a-real-secret';

    expect(isInternalRequest(req({ [INTERNAL_HEADER]: 'guess' }))).toBe(false);
    expect(isInternalRequest(req())).toBe(false);
  });

  it('does not compare by length, so a short guess is not cheap', () => {
    process.env.INTERNAL_API_SECRET = 'a-real-secret';

    // Hashing both sides first keeps timingSafeEqual from throwing on a length
    // mismatch, which is the failure mode that would leak the length.
    expect(() => isInternalRequest(req({ [INTERNAL_HEADER]: 'x' }))).not.toThrow();
    expect(isInternalRequest(req({ [INTERNAL_HEADER]: 'x' }))).toBe(false);
  });

  it('sends the header only when there is one to send', () => {
    process.env.INTERNAL_API_SECRET = 'a-real-secret';
    expect(internalHeaders()).toEqual({ [INTERNAL_HEADER]: 'a-real-secret' });
  });
});
