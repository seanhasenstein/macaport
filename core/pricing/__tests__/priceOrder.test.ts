import { priceOrder, PriceLine, ShippingInput } from '../priceOrder';

const WI = 0.055;

const pickup: ShippingInput = {
  method: 'Primary',
  price: 800,
  freeMinimum: 5000,
};
const direct: ShippingInput = { ...pickup, method: 'Direct' };

const line = (overrides: Partial<PriceLine> & { id: string }): PriceLine => ({
  unitPrice: 2000,
  quantity: 1,
  ...overrides,
});

const kinds = (result: ReturnType<typeof priceOrder>) =>
  result.adjustments.map(a => a.kind);

describe('priceOrder with no benefit', () => {
  it('prices a plain cart: items, tax, no shipping on pickup', () => {
    const result = priceOrder({
      lines: [
        line({ id: 'a', quantity: 2 }),
        line({ id: 'b', unitPrice: 1500 }),
      ],
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.subtotal).toBe(5500);
    expect(result.merchandiseTotal).toBe(5500);
    expect(result.taxableAmount).toBe(5500);
    expect(result.salesTax).toBe(303); // 302.5 rounds up
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(5803);
    expect(result.adjustments).toEqual([]);
    expect(result.lines[0].lineSubtotal).toBe(4000);
    expect(result.lines[0].lineTotal).toBe(4000);
  });

  it('charges add-ons per unit', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', addOnUnitPrice: 500, quantity: 3 })],
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.subtotal).toBe(7500);
  });

  it('charges direct shipping below the free threshold and not at it', () => {
    const below = priceOrder({
      lines: [line({ id: 'a', unitPrice: 4999 })],
      taxRate: 0,
      shipping: direct,
    });
    const at = priceOrder({
      lines: [line({ id: 'a', unitPrice: 5000 })],
      taxRate: 0,
      shipping: direct,
    });

    expect(below.shipping).toBe(800);
    expect(below.total).toBe(5799);
    expect(at.shipping).toBe(0);
    expect(at.total).toBe(5000);
  });

  it('never charges shipping for store pickup', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 100 })],
      taxRate: 0,
      shipping: { ...direct, method: 'Store Pickup' },
    });

    expect(result.shipping).toBe(0);
  });

  it('honours a zero tax rate, which is what a tax-exempt store will be', () => {
    const result = priceOrder({
      lines: [line({ id: 'a' })],
      taxRate: 0,
      shipping: pickup,
    });

    expect(result.salesTax).toBe(0);
    expect(result.total).toBe(2000);
  });
});

describe('priceOrder with a credit', () => {
  const credit = (remaining: number) => ({
    type: 'credit' as const,
    label: 'Employee Credit',
    remaining,
  });

  it('pays part of the order; tax is on the full price, not the remainder', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 8000 })],
      benefit: credit(7500),
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.subtotal).toBe(8000);
    expect(result.taxableAmount).toBe(8000);
    expect(result.salesTax).toBe(440);
    expect(result.creditApplied).toBe(7500);
    expect(result.creditRemaining).toBe(0);
    expect(result.total).toBe(940);
    expect(result.adjustments).toEqual([
      { kind: 'credit', label: 'Employee Credit', amount: -7500 },
    ]);
  });

  it('covers the whole order, tax included, and leaves the rest for next time', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 3000 })],
      benefit: credit(7500),
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.salesTax).toBe(165);
    expect(result.creditApplied).toBe(3165);
    expect(result.creditRemaining).toBe(4335);
    expect(result.total).toBe(0);
  });

  it('covers exactly the order', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 7500 })],
      benefit: credit(7913), // 7500 + 413 tax (412.5 rounds up)
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.creditApplied).toBe(7913);
    expect(result.creditRemaining).toBe(0);
    expect(result.total).toBe(0);
  });

  it('covers shipping too, because it is money and not a price cut', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 3000 })],
      benefit: credit(7500),
      taxRate: WI,
      shipping: direct,
    });

    expect(result.shipping).toBe(800);
    expect(result.creditApplied).toBe(3000 + 165 + 800);
    expect(result.creditRemaining).toBe(7500 - 3965);
    expect(result.total).toBe(0);
  });

  it('measures the free shipping threshold before credit', () => {
    // An $80 purchase paid mostly with credit is still an $80 purchase.
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 8000 })],
      benefit: credit(7500),
      taxRate: WI,
      shipping: direct,
    });

    expect(result.merchandiseTotal).toBe(8000);
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(940);
  });

  it('applies nothing and records nothing when the member has no credit left', () => {
    const result = priceOrder({
      lines: [line({ id: 'a' })],
      benefit: credit(0),
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.creditApplied).toBe(0);
    expect(result.adjustments).toEqual([]);
    expect(result.total).toBe(2110);
  });
});

describe('priceOrder with a fixed discount', () => {
  const discount = (amount: number) => ({
    type: 'discount' as const,
    label: 'Switch Fitness Promo',
    amount,
  });

  it('takes the amount off before tax', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 6000 })],
      benefit: discount(2500),
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.merchandiseTotal).toBe(3500);
    expect(result.salesTax).toBe(193); // 192.5
    expect(result.total).toBe(3693);
    expect(kinds(result)).toEqual(['discount']);
  });

  it('is capped at the cart and never goes negative', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 1000 })],
      benefit: discount(2500),
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.adjustments[0].amount).toBe(-1000);
    expect(result.merchandiseTotal).toBe(0);
    expect(result.total).toBe(0);
  });

  it('lowers the free shipping threshold measure, unlike credit', () => {
    // $60 of goods with $25 off is a $35 purchase for shipping purposes.
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 6000 })],
      benefit: discount(2500),
      taxRate: 0,
      shipping: direct,
    });

    expect(result.shipping).toBe(800);
  });
});

describe('priceOrder with a free item', () => {
  const freeItem = (count: number, productIds: string[] | null = null) => ({
    type: 'freeItem' as const,
    label: 'Free Staff Shirt',
    count,
    productIds,
  });

  it('makes the cheapest qualifying garment free and still charges its add-ons', () => {
    const result = priceOrder({
      lines: [
        line({ id: 'hoodie', unitPrice: 4500 }),
        line({ id: 'tee', unitPrice: 2000, addOnUnitPrice: 600 }),
      ],
      benefit: freeItem(1),
      taxRate: 0,
      shipping: pickup,
    });

    expect(result.adjustments).toEqual([
      {
        kind: 'freeItem',
        label: 'Free Staff Shirt',
        amount: -2000,
        lineId: 'tee',
        units: 1,
      },
    ]);
    expect(result.lines[1].lineTotal).toBe(600);
    expect(result.lines[0].lineTotal).toBe(4500);
    expect(result.merchandiseTotal).toBe(5100);
  });

  it('breaks a price tie by cart order', () => {
    const result = priceOrder({
      lines: [line({ id: 'first' }), line({ id: 'second' })],
      benefit: freeItem(1),
      taxRate: 0,
      shipping: pickup,
    });

    expect(result.adjustments[0].lineId).toBe('first');
  });

  it('covers one unit of a multi-quantity line, not the whole line', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', quantity: 3 })],
      benefit: freeItem(1),
      taxRate: 0,
      shipping: pickup,
    });

    expect(result.adjustments[0].amount).toBe(-2000);
    expect(result.adjustments[0].units).toBe(1);
    expect(result.lines[0].lineTotal).toBe(4000);
  });

  it('spreads a count across the cheapest units in the cart', () => {
    const result = priceOrder({
      lines: [
        line({ id: 'hoodie', unitPrice: 4500 }),
        line({ id: 'tee', unitPrice: 2000, quantity: 2 }),
        line({ id: 'cap', unitPrice: 1500 }),
      ],
      benefit: freeItem(2),
      taxRate: 0,
      shipping: pickup,
    });

    // cap (1500) then one tee (2000); the second tee and the hoodie are paid.
    expect(result.adjustments).toEqual([
      {
        kind: 'freeItem',
        label: 'Free Staff Shirt',
        amount: -2000,
        lineId: 'tee',
        units: 1,
      },
      {
        kind: 'freeItem',
        label: 'Free Staff Shirt',
        amount: -1500,
        lineId: 'cap',
        units: 1,
      },
    ]);
    expect(result.merchandiseTotal).toBe(4500 + 2000);
  });

  it('only considers the products the benefit names', () => {
    const result = priceOrder({
      lines: [
        line({ id: 'cap', unitPrice: 1500, productId: 'p-cap' }),
        line({ id: 'tee', unitPrice: 2000, productId: 'p-tee' }),
      ],
      benefit: freeItem(1, ['p-tee']),
      taxRate: 0,
      shipping: pickup,
    });

    expect(result.adjustments[0].lineId).toBe('tee');
  });

  it('gives nothing when no line qualifies, and never picks a free-priced line', () => {
    const none = priceOrder({
      lines: [line({ id: 'cap', productId: 'p-cap' })],
      benefit: freeItem(1, ['p-tee']),
      taxRate: 0,
      shipping: pickup,
    });
    const zero = priceOrder({
      lines: [line({ id: 'sticker', unitPrice: 0, addOnUnitPrice: 300 })],
      benefit: freeItem(1),
      taxRate: 0,
      shipping: pickup,
    });

    expect(none.adjustments).toEqual([]);
    expect(zero.adjustments).toEqual([]);
  });

  it('stops at the units in the cart when the count is larger', () => {
    const result = priceOrder({
      lines: [line({ id: 'a' })],
      benefit: freeItem(5),
      taxRate: 0,
      shipping: pickup,
    });

    expect(result.adjustments).toHaveLength(1);
    expect(result.merchandiseTotal).toBe(0);
  });
});

describe('the small balance waiver', () => {
  it('forgives a total Stripe would refuse and records it', () => {
    // $71.20 of goods is $75.12 with tax; a $75 credit leaves 12c owed.
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 7120 })],
      benefit: { type: 'credit', label: 'Credit', remaining: 7500 },
      taxRate: WI,
      shipping: pickup,
    });

    expect(result.salesTax).toBe(392); // 391.6
    expect(result.creditApplied).toBe(7500);
    expect(result.waived).toBe(12);
    expect(result.total).toBe(0);
    expect(kinds(result)).toEqual(['credit', 'waived']);
    expect(result.adjustments[1].amount).toBe(-12);
  });

  it('does not touch a total at the minimum, or a zero total', () => {
    const at = priceOrder({
      lines: [line({ id: 'a', unitPrice: 50 })],
      taxRate: 0,
      shipping: pickup,
    });
    const zero = priceOrder({
      lines: [line({ id: 'a', unitPrice: 2000 })],
      benefit: { type: 'credit', label: 'Credit', remaining: 5000 },
      taxRate: WI,
      shipping: pickup,
    });

    expect(at.waived).toBe(0);
    expect(at.total).toBe(50);
    expect(zero.waived).toBe(0);
    expect(zero.adjustments).toHaveLength(1);
  });

  it('respects a caller-supplied minimum', () => {
    const result = priceOrder({
      lines: [line({ id: 'a', unitPrice: 90 })],
      taxRate: 0,
      shipping: pickup,
      minimumCharge: 100,
    });

    expect(result.waived).toBe(90);
    expect(result.total).toBe(0);
  });
});

describe('input validation', () => {
  it('refuses dollars where cents are expected', () => {
    expect(() =>
      priceOrder({
        lines: [line({ id: 'a', unitPrice: 19.99 })],
        taxRate: WI,
        shipping: pickup,
      })
    ).toThrow(/whole number of cents/);
  });

  it('refuses a zero or fractional quantity', () => {
    expect(() =>
      priceOrder({
        lines: [line({ id: 'a', quantity: 0 })],
        taxRate: WI,
        shipping: pickup,
      })
    ).toThrow(/quantity/);
    expect(() =>
      priceOrder({
        lines: [line({ id: 'a', quantity: 1.5 })],
        taxRate: WI,
        shipping: pickup,
      })
    ).toThrow(/quantity/);
  });

  it('refuses a tax rate given as a percentage', () => {
    expect(() =>
      priceOrder({ lines: [line({ id: 'a' })], taxRate: 5.5, shipping: pickup })
    ).toThrow(/taxRate/);
  });

  it('prices an empty cart as zero', () => {
    const result = priceOrder({ lines: [], taxRate: WI, shipping: direct });

    expect(result.subtotal).toBe(0);
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(0);
  });
});
