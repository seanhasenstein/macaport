import { getCheckoutSchema } from '../checkout';

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
