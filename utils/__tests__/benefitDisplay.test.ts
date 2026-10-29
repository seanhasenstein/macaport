import {
  benefitEmailNote,
  FREE_ITEM_NOTE,
  needsFreeItemNote,
  benefitCoversPaidAddons,
  benefitStatus,
  benefitTerms,
  summarizeBenefitUse,
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

describe('the status a signed-in member sees', () => {
  it('leads a credit with what is left, against what it was', () => {
    expect(benefitStatus(view({ member: member('eligible', 5100) }))).toEqual({
      tone: 'active',
      label: 'Active',
      headline: '$51.00',
      note: 'left of $75.00',
      detail: benefitTerms(view()),
    });
  });

  it('does not print the same number twice before anything is spent', () => {
    const fresh = benefitStatus(view({ member: member('eligible', 7500) }));
    expect(fresh?.headline).toBe('$75.00');
    expect(fresh?.note).toBe('to spend');
  });

  it('counts free items, and what is left once some are taken', () => {
    const free = (allowance: number, remaining: number) =>
      benefitStatus(
        view({
          type: 'freeItem',
          amount: allowance,
          member: {
            ...member('eligible', remaining),
            allowance,
            used: allowance - remaining,
          },
        })
      );

    expect(free(1, 1)?.headline).toBe('1 free item');
    expect(free(1, 1)?.note).toBeNull();
    expect(free(3, 3)?.headline).toBe('3 free items');
    expect(free(3, 2)?.headline).toBe('2 free items');
    expect(free(3, 2)?.note).toBe('of your 3');
  });

  it('states a discount as an amount off', () => {
    expect(
      benefitStatus(
        view({
          type: 'discount',
          amount: 2500,
          member: member('eligible', 2500),
        })
      )?.headline
    ).toBe('$25.00');
  });

  it('explains how each type works, in the same words the signed-out card uses', () => {
    // Each leads with what they can do, not with what it does not reach.
    expect(benefitTerms(view())).toBe(
      'Use it across as many orders as you like. Tax and shipping included.'
    );
    // A discount is applied before tax, so it lowers the tax as well; only
    // shipping is outside it. See priceOrder's order of operations.
    expect(benefitTerms(view({ type: 'discount' }))).toBe(
      'Use it on a single order. It comes off your items, not your shipping.'
    );
    expect(benefitTerms(view({ type: 'freeItem' }))).toContain(
      'add-ons are extra'
    );
    // Whatever the panel says is what the status carries.
    expect(
      benefitStatus(view({ member: member('eligible', 100) }))?.detail
    ).toBe(benefitTerms(view()));
  });

  it('gives the spent and paused states a marker of their own', () => {
    expect(benefitStatus(view({ member: member('usedUp', 0) }))).toEqual({
      tone: 'spent',
      label: 'Spent',
      headline: null,
      note: null,
      detail: 'Anything else you order is at the regular price.',
    });
    // The word for "none left" is the natural one for each type.
    expect(
      benefitStatus(view({ type: 'discount', member: member('usedUp', 0) }))
        ?.label
    ).toBe('Already used');
    expect(
      benefitStatus(view({ type: 'freeItem', member: member('usedUp', 0) }))
        ?.label
    ).toBe('Claimed');
    expect(benefitStatus(view({ member: member('paused') }))).toMatchObject({
      tone: 'paused',
      label: 'Paused',
      headline: null,
    });
  });

  it('says nothing when nobody is signed in', () => {
    expect(benefitStatus(view())).toBeNull();
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

  it('gives a credit as two labelled amounts, not a sentence', () => {
    expect(
      summarizeBenefitUse(
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
    ).toEqual({
      label: 'Employee Store Credit',
      used: '$63.30',
      remaining: '$86.70',
    });
  });

  it('counts free items, and says None rather than a zero', () => {
    expect(
      summarizeBenefitUse(
        order(
          {
            benefitId: 'b',
            type: 'freeItem',
            email: 'a@b.com',
            used: 1,
            remainingAfter: 0,
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
    ).toEqual({ label: 'Free shirt', used: '1 item', remaining: 'None' });

    expect(
      summarizeBenefitUse(
        order(
          {
            benefitId: 'b',
            type: 'freeItem',
            email: 'a@b.com',
            used: 2,
            remainingAfter: 3,
          },
          [
            {
              kind: 'freeItem',
              label: 'Free shirt',
              amount: -4000,
              lineId: 'l1',
              units: 2,
            },
          ]
        )
      )
    ).toMatchObject({ used: '2 items', remaining: '3 items' });
  });

  it('says nothing for an order with no benefit, or for a discount', () => {
    expect(summarizeBenefitUse(order(undefined, []))).toBeNull();
    expect(
      summarizeBenefitUse(
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

describe('why a free item still has a price', () => {
  const freeItem = {
    kind: 'freeItem' as const,
    label: 'Free shirt',
    amount: -2000,
    lineId: 'l1',
    units: 1,
  };

  it('explains the line only when something on it is still charged', () => {
    // Garment free, $5 name still payable: the badge and the amount beside
    // it look like a contradiction without words.
    expect(needsFreeItemNote(500, [freeItem], 1)).toBe(true);
    // Nothing owed, so nothing to explain.
    expect(needsFreeItemNote(0, [freeItem], 1)).toBe(false);
    // A paid line with no benefit on it needs no note either.
    expect(needsFreeItemNote(2500, [], 1)).toBe(false);
    expect(
      needsFreeItemNote(
        500,
        [{ kind: 'credit', label: 'Credit', amount: -1000 }],
        1
      )
    ).toBe(false);
  });

  it('stays quiet when the charge is more garments, not add-ons', () => {
    // Three shirts at $20 with one free. The $40 left is two more shirts,
    // and telling this shopper that add-ons are charged would be false:
    // there is no personalization on the line at all.
    expect(needsFreeItemNote(4000, [freeItem], 3)).toBe(false);
    // Two of three covered is still not all of them.
    expect(needsFreeItemNote(2000, [{ ...freeItem, units: 2 }], 3)).toBe(false);
    // Every garment covered and a charge remains, so it can only be add-ons.
    expect(needsFreeItemNote(1500, [{ ...freeItem, units: 3 }], 3)).toBe(true);
  });

  it('does not fire on a free-item adjustment that covered nothing', () => {
    expect(needsFreeItemNote(2500, [{ ...freeItem, units: 0 }], 1)).toBe(false);
    const { units, ...noUnits } = freeItem;
    expect(needsFreeItemNote(2500, [noUnits], 1)).toBe(false);
  });

  it('says what is covered, not only what is not', () => {
    expect(FREE_ITEM_NOTE).toContain('covers the garment');
    expect(FREE_ITEM_NOTE).toContain('Add-ons are charged');
  });
});

describe('whether the terms mention paid add-ons', () => {
  const addon = (price: number, subItems: any[] = []) => ({
    id: 'a1',
    name: 'Name',
    location: 'Front',
    type: 'string' as const,
    list: [],
    price,
    lines: 1,
    limit: 1,
    subItems,
  });

  const product = (id: string, active: boolean, addons: any[]): any => ({
    id,
    name: `Product ${id}`,
    personalization: { active, maxLines: 1, addons },
  });

  it('keeps the add-on sentence only where an add-on can be charged', () => {
    expect(benefitTerms(view({ type: 'freeItem' }), true)).toContain(
      'add-ons are extra'
    );
    expect(benefitTerms(view({ type: 'freeItem' }), false)).toBe(
      'Add it to your cart at no charge.'
    );
  });

  it('still offers the item when the sentence is dropped', () => {
    expect(benefitTerms(view({ type: 'freeItem' }), false)).toContain(
      'at no charge'
    );
  });

  it('leaves credit and discount terms alone', () => {
    expect(benefitTerms(view({ type: 'credit' }), false)).toBe(
      benefitTerms(view({ type: 'credit' }), true)
    );
    expect(benefitTerms(view({ type: 'discount' }), false)).toBe(
      benefitTerms(view({ type: 'discount' }), true)
    );
  });

  it('assumes add-ons apply when nobody says otherwise', () => {
    // Silence must not hide a charge the shopper will meet at checkout.
    expect(benefitTerms(view({ type: 'freeItem' }))).toContain(
      'add-ons are extra'
    );
    expect(
      benefitStatus(
        view({
          type: 'freeItem',
          amount: 1,
          member: { ...member('eligible', 1), allowance: 1, used: 0 },
        })
      )?.detail
    ).toContain('add-ons are extra');
  });

  it('finds a priced add-on on a covered product', () => {
    const products = [product('p1', true, [addon(500)])];
    expect(benefitCoversPaidAddons({ productIds: null }, products)).toBe(true);
    expect(benefitCoversPaidAddons({ productIds: ['p1'] }, products)).toBe(
      true
    );
  });

  it('ignores a priced add-on on a product the benefit does not cover', () => {
    const products = [
      product('p1', true, [addon(500)]),
      product('p2', true, []),
    ];
    expect(benefitCoversPaidAddons({ productIds: ['p2'] }, products)).toBe(
      false
    );
  });

  it('ignores personalization that is switched off, or free', () => {
    expect(
      benefitCoversPaidAddons({ productIds: null }, [
        product('p1', false, [addon(500)]),
      ])
    ).toBe(false);
    expect(
      benefitCoversPaidAddons({ productIds: null }, [
        product('p1', true, [addon(0)]),
      ])
    ).toBe(false);
  });

  it('looks inside sub-items for the price', () => {
    // A free parent option can still carry a charged choice beneath it.
    expect(
      benefitCoversPaidAddons({ productIds: null }, [
        product('p1', true, [addon(0, [addon(0), addon(300)])]),
      ])
    ).toBe(true);
  });

  it('covers nothing on an empty product list or an empty productIds', () => {
    expect(benefitCoversPaidAddons({ productIds: null }, [])).toBe(false);
    expect(
      benefitCoversPaidAddons({ productIds: [] }, [
        product('p1', true, [addon(500)]),
      ])
    ).toBe(false);
  });
});

describe('the note when a receipt is sent somewhere else', () => {
  const verified = 'staff@school.org';

  it('speaks up once the address no longer matches', () => {
    const note = benefitEmailNote(
      verified,
      'me@home.com',
      'Employee Credit',
      true
    );
    expect(note).toBe(
      'Your Employee Credit stays with staff@school.org. Your receipt will go to this address.'
    );
  });

  it('stays quiet while the address is the verified one', () => {
    expect(
      benefitEmailNote(verified, verified, 'Employee Credit', true)
    ).toBeNull();
  });

  it('ignores case and surrounding spaces before deciding', () => {
    // Retyping the same address differently is not a change worth a note.
    expect(
      benefitEmailNote(verified, '  STAFF@School.org ', 'Employee Credit', true)
    ).toBeNull();
  });

  it('says nothing for a benefit that would not apply anyway', () => {
    // Paused, or spent to the last cent. The member still has a session and
    // a prefilled address, but saying the credit "stays with" it would
    // promise something the store page already calls SPENT.
    expect(
      benefitEmailNote(verified, 'me@home.com', 'Employee Credit', false)
    ).toBeNull();
  });

  it('says nothing with no verified member, no name, or an empty field', () => {
    expect(
      benefitEmailNote(null, 'me@home.com', 'Employee Credit', true)
    ).toBeNull();
    expect(benefitEmailNote(verified, 'me@home.com', null, true)).toBeNull();
    expect(benefitEmailNote(verified, '', 'Employee Credit', true)).toBeNull();
    expect(
      benefitEmailNote(verified, '   ', 'Employee Credit', true)
    ).toBeNull();
    expect(
      benefitEmailNote(undefined, undefined, undefined, true)
    ).toBeNull();
  });

  it('names the benefit the client chose, not a generic word', () => {
    expect(
      benefitEmailNote(verified, 'me@home.com', 'Free Staff Shirt', true)
    ).toContain('Your Free Staff Shirt stays with');
  });
});
