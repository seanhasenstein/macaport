import { expectedTotalFrom, getCheckoutSchema } from '../checkout';

const values = (email: string) => ({
  customer: {
    firstName: 'Sam',
    lastName: 'Rivera',
    email,
    phone: '(920) 555-0134',
  },
  groupRequired: false,
  group: '',
  shippingMethod: 'Primary',
  cardholderName: 'Sam Rivera',
});

const isValid = (email: string) =>
  getCheckoutSchema('team', true).isValidSync(values(email));

describe('the checkout email check', () => {
  it('accepts an address with the space a phone suggestion leaves after it', () => {
    expect(isValid('sam@example.com ')).toBe(true);
    expect(isValid(' sam@example.com')).toBe(true);
  });

  it('still refuses an address that is not one', () => {
    expect(isValid('sam@example')).toBe(false);
    expect(isValid('sam o@example.com')).toBe(false);
    expect(isValid('   ')).toBe(false);
  });
});

describe('the ceiling on what may be charged', () => {
  it('takes a whole number of cents, zero included', () => {
    expect(expectedTotalFrom({ expectedTotal: 528 })).toBe(528);
    expect(expectedTotalFrom({ expectedTotal: 0 })).toBe(0);
  });

  it('treats anything it cannot trust as no ceiling at all', () => {
    // A missing value is an older page, not an attack: the server then
    // behaves exactly as it did before the ceiling existed.
    expect(expectedTotalFrom({})).toBeNull();
    expect(expectedTotalFrom({ expectedTotal: undefined })).toBeNull();
    expect(expectedTotalFrom({ expectedTotal: null })).toBeNull();
    expect(expectedTotalFrom({ expectedTotal: '528' })).toBeNull();
    expect(expectedTotalFrom({ expectedTotal: 5.28 })).toBeNull();
    expect(expectedTotalFrom({ expectedTotal: -100 })).toBeNull();
    expect(expectedTotalFrom({ expectedTotal: NaN })).toBeNull();
    expect(expectedTotalFrom({ expectedTotal: Infinity })).toBeNull();
    expect(expectedTotalFrom({ expectedTotal: {} })).toBeNull();
  });

  it('cannot be used to pay less, only to stop the order', () => {
    // The value is a ceiling, never a floor. Sending a tiny number makes
    // the server refuse; it never makes the server charge that number.
    const serverTotal = 2110;
    const claim = (n: number) => {
      const ceiling = expectedTotalFrom({ expectedTotal: n });
      return ceiling !== null && serverTotal > ceiling ? 'refused' : 'charged';
    };
    expect(claim(1)).toBe('refused');
    expect(claim(528)).toBe('refused');
    expect(claim(2110)).toBe('charged');
    expect(claim(999999)).toBe('charged');
  });
});
