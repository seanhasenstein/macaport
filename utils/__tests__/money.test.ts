import { formatToMoney } from '../index';

describe('formatToMoney', () => {
  it('never shows a single decimal place', () => {
    // The bug this replaces: 330 rendered as "$3.3" for every caller that
    // left the flag off, which was most of them.
    expect(formatToMoney(330)).toBe('$3.30');
    expect(formatToMoney(6330)).toBe('$63.30');
    expect(formatToMoney(2550)).toBe('$25.50');
    expect(formatToMoney(5)).toBe('$0.05');
  });

  it('leaves a whole dollar amount compact unless asked', () => {
    expect(formatToMoney(2000)).toBe('$20');
    expect(formatToMoney(0)).toBe('$0');
    expect(formatToMoney(2000, true)).toBe('$20.00');
    expect(formatToMoney(0, true)).toBe('$0.00');
  });
});
