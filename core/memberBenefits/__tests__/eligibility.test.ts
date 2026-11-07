import {
  memberEligibility,
  normalizeEmail,
  findMember,
  usageFor,
} from '../eligibility';
import { MemberBenefit, MemberBenefitMember } from '../types';

const member = (
  overrides: Partial<MemberBenefitMember> = {}
): MemberBenefitMember => ({
  email: 'pat@example.com',
  used: 0,
  orderIds: [],
  ...overrides,
});

const benefit = (overrides: Partial<MemberBenefit> = {}): MemberBenefit => ({
  _id: 'b1',
  storeId: 's1',
  type: 'credit',
  amount: 7500,
  productIds: null,
  access: 'public',
  funding: 'client',
  copy: { benefitName: 'Employee Credit', memberLabel: 'Employees' },
  active: true,
  members: [member()],
  createdAt: '',
  updatedAt: '',
  ...overrides,
});

describe('finding a member', () => {
  it('matches case- and whitespace-insensitively', () => {
    expect(normalizeEmail('  Pat@Example.COM ')).toBe('pat@example.com');
    expect(findMember(benefit(), ' PAT@example.com')).toBeDefined();
  });

  it('copes with a list that was stored unnormalized', () => {
    const b = benefit({ members: [member({ email: 'Pat@Example.com ' })] });
    expect(findMember(b, 'pat@example.com')).toBeDefined();
  });
});

describe('credit eligibility', () => {
  it('reports the full balance for a fresh member', () => {
    const result = memberEligibility(benefit(), 'pat@example.com');

    expect(result.reason).toBe('eligible');
    expect(result.eligible).toBe(true);
    expect(result.allowance).toBe(7500);
    expect(result.used).toBe(0);
    expect(result.remaining).toBe(7500);
    expect(result.forPricing).toEqual({
      type: 'credit',
      label: 'Employee Credit',
      remaining: 7500,
    });
    expect(result.member?.email).toBe('pat@example.com');
  });

  it('reports what is left after earlier orders', () => {
    const b = benefit({ members: [member({ used: 3000 })] });
    const result = memberEligibility(b, 'pat@example.com');

    expect(result.remaining).toBe(4500);
    expect(result.forPricing).toMatchObject({ remaining: 4500 });
  });

  it('honours a per-member allowance', () => {
    const b = benefit({ members: [member({ allowance: 10000, used: 1000 })] });

    expect(memberEligibility(b, 'pat@example.com').remaining).toBe(9000);
  });

  it('is used up at zero and never goes negative', () => {
    const b = benefit({ members: [member({ used: 8000 })] });
    const result = memberEligibility(b, 'pat@example.com');

    expect(result.reason).toBe('usedUp');
    expect(result.eligible).toBe(false);
    expect(result.remaining).toBe(0);
    expect(result.forPricing).toBeNull();
    expect(result.member).toBeDefined();
  });

  it('rejects an email that is not on the list', () => {
    const result = memberEligibility(benefit(), 'someone@else.com');

    expect(result.reason).toBe('notMember');
    expect(result.eligible).toBe(false);
    expect(result.member).toBeUndefined();
    expect(result.forPricing).toBeNull();
  });

  it('is paused when the benefit is inactive, even for a member with balance', () => {
    const result = memberEligibility(
      benefit({ active: false }),
      'pat@example.com'
    );

    expect(result.reason).toBe('paused');
    expect(result.eligible).toBe(false);
    expect(result.remaining).toBe(7500);
    expect(result.forPricing).toBeNull();
  });

  it('treats a member record without a used field as unused', () => {
    const b = benefit({
      members: [{ email: 'pat@example.com' } as MemberBenefitMember],
    });

    expect(memberEligibility(b, 'pat@example.com').remaining).toBe(7500);
  });
});

describe('discount eligibility', () => {
  const discount = benefit({
    type: 'discount',
    amount: 2500,
    copy: { benefitName: 'Switch Fitness Promo', memberLabel: 'Members' },
  });

  it('hands the pipeline the amount off', () => {
    const result = memberEligibility(discount, 'pat@example.com');

    expect(result.forPricing).toEqual({
      type: 'discount',
      label: 'Switch Fitness Promo',
      amount: 2500,
    });
  });

  it('is one use: any use consumes the whole allowance', () => {
    const result = memberEligibility(discount, 'pat@example.com');

    expect(
      usageFor(discount, result, {
        creditApplied: 0,
        freeUnits: 0,
        discountApplied: 1000,
      })
    ).toBe(2500);
    expect(
      usageFor(discount, result, {
        creditApplied: 0,
        freeUnits: 0,
        discountApplied: 0,
      })
    ).toBe(0);
  });

  it('is used up after that', () => {
    const used = { ...discount, members: [member({ used: 2500 })] };

    expect(memberEligibility(used, 'pat@example.com').reason).toBe('usedUp');
  });
});

describe('free item eligibility', () => {
  const free = benefit({
    type: 'freeItem',
    amount: 1,
    productIds: ['p-tee'],
    copy: { benefitName: 'Free Staff Shirt', memberLabel: 'Staff' },
  });

  it('hands the pipeline the count and the qualifying products', () => {
    const result = memberEligibility(free, 'pat@example.com');

    expect(result.remaining).toBe(1);
    expect(result.forPricing).toEqual({
      type: 'freeItem',
      label: 'Free Staff Shirt',
      count: 1,
      productIds: ['p-tee'],
    });
  });

  it('draws down by garments covered', () => {
    const result = memberEligibility(free, 'pat@example.com');

    expect(
      usageFor(free, result, {
        creditApplied: 0,
        freeUnits: 1,
        discountApplied: 0,
      })
    ).toBe(1);
  });
});

describe('credit usage', () => {
  it('draws down by cents applied', () => {
    const b = benefit();
    const result = memberEligibility(b, 'pat@example.com');

    expect(
      usageFor(b, result, {
        creditApplied: 4200,
        freeUnits: 0,
        discountApplied: 0,
      })
    ).toBe(4200);
  });
});
