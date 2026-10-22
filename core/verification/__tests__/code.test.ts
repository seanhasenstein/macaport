import {
  requestCode,
  checkCode,
  codeFor,
  normalizeCode,
  CODE_TTL_MS,
  MAX_ATTEMPTS,
  RESEND_COOLDOWN_MS,
  CodeRecord,
} from '../code';

const secret = 'test-secret';
const input = (now: number) => ({
  benefitId: 'b1',
  email: 'pat@example.com',
  secret,
  now,
});

const fresh = (now = 0) => {
  const result = requestCode(null, input(now), 'nonce-1');
  if (result.kind !== 'send') throw new Error('expected a send');
  return result;
};

describe('requesting a code', () => {
  it('mints six digits derived from the secret, never stored', () => {
    const { record, code } = fresh();

    expect(code).toMatch(/^\d{6}$/);
    expect(JSON.stringify(record)).not.toContain(code);
    expect(codeFor(record, secret)).toBe(code);
    expect(codeFor(record, 'another-secret')).not.toBe(code);
  });

  it('expires ten minutes after it was minted', () => {
    const { record } = fresh(1000);

    expect(record.expiresAt).toBe(1000 + CODE_TTL_MS);
    expect(record.attempts).toBe(0);
    expect(record.sendCount).toBe(1);
  });

  it('is refused within the cooldown', () => {
    const { record } = fresh(0);
    const again = requestCode(record, input(RESEND_COOLDOWN_MS - 1));

    expect(again.kind).toBe('cooldown');
    if (again.kind === 'cooldown') expect(again.retryAfterMs).toBe(1);
  });

  it('resends the same code after the cooldown', () => {
    const first = fresh(0);
    const again = requestCode(first.record, input(RESEND_COOLDOWN_MS));

    expect(again.kind).toBe('send');
    if (again.kind !== 'send') return;
    expect(again.code).toBe(first.code);
    expect(again.resent).toBe(true);
    expect(again.record.nonce).toBe(first.record.nonce);
    expect(again.record.expiresAt).toBe(first.record.expiresAt);
    expect(again.record.sendCount).toBe(2);
    expect(again.record.lastSentAt).toBe(RESEND_COOLDOWN_MS);
  });

  it('mints a new code once the old one has expired', () => {
    const first = fresh(0);
    const later = requestCode(first.record, input(CODE_TTL_MS), 'nonce-2');

    expect(later.kind).toBe('send');
    if (later.kind !== 'send') return;
    expect(later.resent).toBe(false);
    expect(later.record.nonce).toBe('nonce-2');
    expect(later.record.expiresAt).toBe(CODE_TTL_MS + CODE_TTL_MS);
  });

  it('mints a new code once the old one is locked out', () => {
    const first = fresh(0);
    const locked = { ...first.record, attempts: MAX_ATTEMPTS };
    const later = requestCode(locked, input(RESEND_COOLDOWN_MS), 'nonce-2');

    expect(later.kind).toBe('send');
    if (later.kind === 'send') expect(later.record.attempts).toBe(0);
  });

  it('ignores a record that belongs to another email or benefit', () => {
    const other: CodeRecord = { ...fresh(0).record, email: 'x@example.com' };
    const result = requestCode(other, input(1), 'nonce-2');

    expect(result.kind).toBe('send');
    if (result.kind === 'send')
      expect(result.record.email).toBe('pat@example.com');
  });
});

describe('checking a code', () => {
  it('accepts the right code with spaces or dashes in it', () => {
    const { record, code } = fresh(0);
    const spaced = `${code.slice(0, 3)} ${code.slice(3)}`;
    const dashed = `${code.slice(0, 3)}-${code.slice(3)}`;

    expect(checkCode(record, code, secret, 1)).toBe('ok');
    expect(checkCode(record, spaced, secret, 1)).toBe('ok');
    expect(checkCode(record, dashed, secret, 1)).toBe('ok');
    expect(normalizeCode(' 12 34-56 ')).toBe('123456');
  });

  it('rejects a wrong or malformed code', () => {
    const { record, code } = fresh(0);
    const wrong = code === '000000' ? '000001' : '000000';

    expect(checkCode(record, wrong, secret, 1)).toBe('wrong');
    expect(checkCode(record, code.slice(1), secret, 1)).toBe('wrong');
    expect(checkCode(record, '', secret, 1)).toBe('wrong');
  });

  it('reports expiry and lockout ahead of correctness', () => {
    const { record, code } = fresh(0);

    expect(checkCode(record, code, secret, CODE_TTL_MS)).toBe('expired');
    expect(checkCode(null, code, secret, 1)).toBe('expired');
    expect(
      checkCode({ ...record, attempts: MAX_ATTEMPTS }, code, secret, 1)
    ).toBe('lockedOut');
  });

  it('rejects a code minted under a different secret', () => {
    const { record, code } = fresh(0);

    expect(checkCode(record, code, 'rotated', 1)).toBe('wrong');
  });
});
