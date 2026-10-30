import { formatPhoneInput, formatPhoneNumber, removeNonDigits } from '../index';

// The contact form and checkout both pass the field's previous value in, so
// every case here is written the way a real keystroke arrives.
const typed = (next: string, previous = '') => formatPhoneInput(next, previous);

describe('the phone number a customer reads', () => {
  it('builds up as they type, one digit at a time', () => {
    expect(typed('')).toBe('');
    expect(typed('9')).toBe('(9');
    expect(typed('(9' + '2', '(9')).toBe('(92');
    expect(typed('(92' + '0', '(92')).toBe('(920) ');
    expect(typed('(920) 55', '(920) 5')).toBe('(920) 55');
    expect(typed('(920) 555', '(920) 55')).toBe('(920) 555-');
    expect(typed('9205550134')).toBe('(920) 555-0134');
  });

  it('keeps anything that is not a digit out', () => {
    expect(typed('abc920def555ghi0134')).toBe('(920) 555-0134');
    expect(typed('920-555-0134')).toBe('(920) 555-0134');
    expect(typed('(920) 555-0134')).toBe('(920) 555-0134');
  });

  it('takes a digit when a formatting character is deleted', () => {
    // Backspacing the space out of "(920) " leaves the same three digits.
    // Reformatting would put the space straight back and the key would look
    // dead, so a digit goes instead.
    expect(typed('(920)', '(920) ')).toBe('(92');
    expect(typed('(920) 555', '(920) 555-')).toBe('(920) 55');
    // A normal delete that does remove a digit is left alone.
    expect(typed('(920) 555-013', '(920) 555-0134')).toBe('(920) 555-013');
  });

  it('drops a pasted country code rather than the last digit', () => {
    // Taking the first ten of 19205550134 would keep the 1 and lose the 4,
    // which is a wrong number that still passes a ten digit check.
    expect(typed('+1 (920) 555-0134')).toBe('(920) 555-0134');
    expect(typed('19205550134')).toBe('(920) 555-0134');
  });

  it('stops at ten digits', () => {
    expect(typed('92055501349999')).toBe('(920) 555-0134');
    // Not a country code, so nothing comes off the front.
    expect(typed('29205550134')).toBe('(292) 055-5013');
  });

  it('round-trips to the digits an order or inquiry stores', () => {
    expect(removeNonDigits(typed('9205550134'))).toBe('9205550134');
    expect(removeNonDigits(typed('+1 920 555 0134'))).toBe('9205550134');
  });

  it('formats a stored number the same way the field does', () => {
    // The receipt and the confirmation page read from the stored digits.
    expect(formatPhoneNumber('9205550134')).toBe(typed('9205550134'));
  });
});
