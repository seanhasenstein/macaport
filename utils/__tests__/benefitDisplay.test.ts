import {
  describeBenefitUse,
  describeRemaining,
  membersOnlyLockout,
  orderAdjustments,
  splitAdjustments,
} from '../benefitDisplay';
import { BenefitView, Order } from '../../interfaces';

const view = (overrides: Partial<BenefitView> = {}): BenefitView => ({
  id: 'b1',
  type: 'credit',
  access: 'public',
  active: true,
  copy: { benefitName: 'Employee Credit', memberLabel: 'Employees' },
  amount: 7500,
  productIds: null,
  member: null,
  ...overrides,
});

const member = (
  reason: BenefitView['member'] extends infer M
    ? M extends { reason: infer R }
      ? R
      : never
    : never,
  remaining = 7500
) => ({
  email: 'pat@example.com',
  firstName: null,
  lastName: null,
  reason,
  allowance: 7500,
  used: 7500 - remaining,
  remaining,
  forPricing: null,
});

describe('members-only lockout', () => {
  it('locks a members-only store for anyone not signed in', () => {
    expect(membersOnlyLockout(view({ access: 'members' }))).toBe(true);
  });

  it('never locks a public store, signed in or not', () => {
    expect(membersOnlyLockout(view())).toBe(false);
    expect(membersOnlyLockout(null)).toBe(false);
  });

  it('lets a verified member in even when they have used everything up', () => {
    expect(
      membersOnlyLockout(
        view({ access: 'members', member: member('usedUp', 0) })
      )
    ).toBe(false);
    expect(
      membersOnlyLockout(view({ access: 'members', member: member('paused') }))
    ).toBe(false);
  });
});

describe('what a member sees as remaining', () => {
  it('states a credit as a balance of the allowance', () => {
    expect(describeRemaining(view({ member: member('eligible', 170) }))).toBe(
      'You have $1.70 of $75.00 left to spend.'
    );
  });

  it('states a free item as a count', () => {
    expect(
      describeRemaining(
        view({ type: 'freeItem', amount: 2, member: member('eligible', 2) })
      )
    ).toBe('You have 2 free items left.');
  });
});

describe('adjustments on an order not yet migrated', () => {
  const base = {
    items: [],
    summary: {
      subtotal: 1000,
      shipping: 0,
      salesTax: 0,
      total: 0,
      stripeFee: 0,
    },
  } as unknown as Order;

  it('prefers the stored list when there is one', () => {
    const stored = [{ kind: 'credit' as const, label: 'X', amount: -100 }];
    expect(
      orderAdjustments({
        ...base,
        summary: { ...base.summary, adjustments: stored },
      })
    ).toBe(stored);
  });

  it('derives the Sheboygan credit from the legacy field', () => {
    expect(
      orderAdjustments({
        ...base,
        sheboyganLutheranStaffDiscount: {
          id: 'x',
          email: 'a@b.com',
          discount: 7500,
        },
      })
    ).toEqual([
      {
        kind: 'credit',
        label: 'Sheboygan Lutheran Staff Credit',
        amount: -7500,
      },
    ]);
  });

  it('derives the Switch Fitness discount from the legacy summary figure', () => {
    expect(
      orderAdjustments({
        ...base,
        summary: { ...base.summary, discount: 2500 },
        switchFitnessDiscount: { id: 'x', email: 'a@b.com' },
      })
    ).toEqual([
      { kind: 'discount', label: 'Switch Fitness Promo', amount: -2500 },
    ]);
  });

  it('finds the free shirt by its zero total', () => {
    const items = [
      { id: 'paid', itemTotal: 2000, sku: { size: { price: 2000 } } },
      { id: 'free', itemTotal: 0, sku: { size: { price: 2000 } } },
    ] as unknown as Order['items'];
    expect(
      orderAdjustments({
        ...base,
        items,
        teacherAppreciation: { id: 'x', email: 'a@b.com' },
      })
    ).toEqual([
      {
        kind: 'freeItem',
        label: 'Free Staff Appreciation Shirt',
        amount: -2000,
        lineId: 'free',
        units: 1,
      },
    ]);
  });
});

describe('the order totals read in the order they were applied', () => {
  const split = splitAdjustments([
    {
      kind: 'freeItem',
      label: 'Free shirt',
      amount: -2000,
      lineId: 'l1',
      units: 1,
    },
    { kind: 'discount', label: 'Promo', amount: -500 },
    { kind: 'credit', label: 'Credit', amount: -6330 },
    { kind: 'waived', label: 'Small balance waived', amount: -12 },
  ]);

  it('puts price changes above the tax and payments below it', () => {
    expect(split.beforeTax.map(a => a.kind)).toEqual(['freeItem', 'discount']);
    expect(split.afterShipping.map(a => a.kind)).toEqual(['credit', 'waived']);
  });

  it('keeps every adjustment, in order', () => {
    expect(split.beforeTax).toHaveLength(2);
    expect(split.afterShipping).toHaveLength(2);
  });
});

describe('what an order drew on', () => {
  const order = (benefit: unknown, adjustments: unknown[]) =>
    ({
      items: [],
      summary: {
        subtotal: 6000,
        shipping: 0,
        salesTax: 330,
        total: 0,
        stripeFee: 0,
        adjustments,
      },
      benefit,
    } as unknown as Order);

  it('states a credit as used and left', () => {
    expect(
      describeBenefitUse(
        order(
          {
            benefitId: 'b',
            type: 'credit',
            email: 'a@b.com',
            used: 6330,
            remainingAfter: 8670,
          },
          [{ kind: 'credit', label: 'Employee Store Credit', amount: -6330 }]
        )
      )
    ).toBe(
      'Employee Store Credit: $63.30 used on this order, $86.70 left to spend.'
    );
  });

  it('states free items as a count, singular when there is one', () => {
    expect(
      describeBenefitUse(
        order(
          {
            benefitId: 'b',
            type: 'freeItem',
            email: 'a@b.com',
            used: 1,
            remainingAfter: 1,
          },
          [
            {
              kind: 'freeItem',
              label: 'Free shirt',
              amount: -2000,
              lineId: 'l1',
              units: 1,
            },
          ]
        )
      )
    ).toBe('Free shirt: 1 free item left.');
  });

  it('says nothing for an order with no benefit, or for a discount', () => {
    expect(describeBenefitUse(order(undefined, []))).toBeNull();
    expect(
      describeBenefitUse(
        order(
          {
            benefitId: 'b',
            type: 'discount',
            email: 'a@b.com',
            used: 2500,
            remainingAfter: 0,
          },
          []
        )
      )
    ).toBeNull();
  });
});
