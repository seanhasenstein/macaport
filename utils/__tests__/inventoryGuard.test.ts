import { looksLikeCheckoutItems } from '../inventory';

const item = (quantity: any) => ({
  quantity,
  sku: { inventoryProductId: 'p1', inventorySkuId: 's1' },
});

describe('inventory write guard', () => {
  it('accepts a real checkout line', () => {
    expect(looksLikeCheckoutItems([item(3)])).toBe(true);
  });

  it('refuses a negative quantity, which would add stock instead of removing it', () => {
    // inventory - (-1000) inflates the count and causes overselling.
    expect(looksLikeCheckoutItems([item(-1000)])).toBe(false);
  });

  it('refuses zero, fractions and absurd counts', () => {
    expect(looksLikeCheckoutItems([item(0)])).toBe(false);
    expect(looksLikeCheckoutItems([item(1.5)])).toBe(false);
    expect(looksLikeCheckoutItems([item(10_001)])).toBe(false);
    expect(looksLikeCheckoutItems([item('3')])).toBe(false);
    expect(looksLikeCheckoutItems([item(NaN)])).toBe(false);
  });

  it('refuses a body that is not a list of items', () => {
    expect(looksLikeCheckoutItems([])).toBe(false);
    expect(looksLikeCheckoutItems({})).toBe(false);
    expect(looksLikeCheckoutItems(null)).toBe(false);
    expect(looksLikeCheckoutItems([{ quantity: 1 }])).toBe(false);
    expect(looksLikeCheckoutItems([null])).toBe(false);
  });

  it('refuses a body long enough to be a script rather than an order', () => {
    expect(looksLikeCheckoutItems(new Array(201).fill(item(1)))).toBe(false);
  });

  it('refuses if any one line is bad, not just the first', () => {
    expect(looksLikeCheckoutItems([item(2), item(-5)])).toBe(false);
  });
});
