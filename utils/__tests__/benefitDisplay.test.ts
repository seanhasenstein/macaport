import {
  describeRemaining,
  membersOnlyLockout,
  orderAdjustments,
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
