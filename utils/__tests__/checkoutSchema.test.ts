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

describe('the gaps a required field alone left open', () => {
  const base = {
    customer: {
      firstName: 'Sean',
      lastName: 'Hasenstein',
      email: 'sean@example.com',
      phone: '9205550134',
    },
    shippingAddress: {
      street: '1 Main St',
      street2: '',
      city: 'New London',
      state: 'Wisconsin',
      zipcode: '54961',
    },
    groupRequired: false,
    group: '',
    shippingMethod: 'Direct',
    cardholderName: 'Sean Hasenstein',
    note: '',
  };

  const accepts = async (patch: Record<string, unknown>) => {
    try {
      await getCheckoutSchema('Group', true).validate({ ...base, ...patch });
      return true;
    } catch {
      return false;
    }
  };

  const address = (patch: Record<string, unknown>) => ({
    shippingAddress: { ...base.shippingAddress, ...patch },
  });
  const customer = (patch: Record<string, unknown>) => ({
    customer: { ...base.customer, ...patch },
  });

  it('wants a zipcode that could actually be posted to', async () => {
    expect(await accepts(address({ zipcode: '54961' }))).toBe(true);
    expect(await accepts(address({ zipcode: '54961-1234' }))).toBe(true);
    expect(await accepts(address({ zipcode: 'abc' }))).toBe(false);
    expect(await accepts(address({ zipcode: '1' }))).toBe(false);
    expect(await accepts(address({ zipcode: '549611' }))).toBe(false);
  });

  it('does not accept a single space as an answer', async () => {
    // The server trims names before storing, so a space became a blank name
    // on a real order.
    expect(await accepts(customer({ firstName: ' ' }))).toBe(false);
    expect(await accepts(customer({ lastName: ' ' }))).toBe(false);
    expect(await accepts(address({ city: '  ' }))).toBe(false);
    expect(await accepts(address({ street: ' ' }))).toBe(false);
    expect(await accepts({ cardholderName: ' ' })).toBe(false);
  });

  it('caps free text so a pasted document cannot reach an order', async () => {
    expect(await accepts(customer({ firstName: 'a'.repeat(101) }))).toBe(false);
    expect(await accepts(customer({ firstName: 'a'.repeat(100) }))).toBe(true);
    expect(await accepts(address({ city: 'a'.repeat(201) }))).toBe(false);
    expect(await accepts({ note: 'x'.repeat(5001) })).toBe(false);
    // A roster of twenty players with names, numbers and sizes runs well
    // past a thousand characters and is a real order, not an abuse.
    expect(await accepts({ note: 'x'.repeat(5000) })).toBe(true);
    expect(await accepts({ note: 'x'.repeat(1500) })).toBe(true);
  });

  it('still lets a normal order through, and an optional line stay empty', async () => {
    expect(await accepts({})).toBe(true);
    expect(await accepts(address({ street2: '' }))).toBe(true);
    expect(await accepts(address({ street2: 'Apt 4B' }))).toBe(true);
  });

  it('leaves the address alone when the order is not being shipped', async () => {
    // Store pickup and primary delivery never fill these in.
    expect(
      await accepts({
        shippingMethod: 'Store Pickup',
        shippingAddress: {
          street: '',
          street2: '',
          city: '',
          state: '',
          zipcode: '',
        },
      })
    ).toBe(true);
  });
});
