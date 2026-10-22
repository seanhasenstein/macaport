import { Adjustment } from '../core/pricing/priceOrder';
import { BenefitView, Order } from '../interfaces';
import { formatToMoney } from './index';

// Pure helpers shared by the browser and the receipt. Nothing in here may
// import the database: utils/memberBenefit.ts does, and anything that
// touches it is server-only.

// Every renderer of an order's totals reads the adjustments through this,
// so an order written by one of the three old programs shows the same rows
// as a new one. Once scripts/migrate-member-benefits.js has run in
// production the legacy branches are dead and can go.
export function orderAdjustments(order: Order): Adjustment[] {
  if (order.summary.adjustments) return order.summary.adjustments;

  const adjustments: Adjustment[] = [];

  if (order.sheboyganLutheranStaffDiscount) {
    adjustments.push({
      kind: 'credit',
      label: 'Sheboygan Lutheran Staff Credit',
      amount: -(order.sheboyganLutheranStaffDiscount.discount || 0),
    });
  }

  if (order.switchFitnessDiscount) {
    adjustments.push({
      kind: 'discount',
      label: 'Switch Fitness Promo',
      amount: -(order.summary.discount || 0),
    });
  }

  if (order.teacherAppreciation) {
    const freeItem = order.items.find(item => item.itemTotal === 0);
    if (freeItem) {
      adjustments.push({
        kind: 'freeItem',
        label: 'Free Staff Appreciation Shirt',
        amount: -freeItem.sku.size.price,
        lineId: freeItem.id,
        units: 1,
      });
    }
  }

  return adjustments;
}

// Totals read in the order the pipeline applied them (see
// core/pricing/priceOrder.ts): a free item and a discount change the price,
// so they sit above the tax they changed; a credit is a payment against the
// whole bill, so it sits below the tax and shipping it paid for. Reading
// top to bottom then gives $60, $3.30 tax, -$63.30 credit, $0 due.
export function splitAdjustments(adjustments: Adjustment[]) {
  return {
    beforeTax: adjustments.filter(
      a => a.kind === 'freeItem' || a.kind === 'discount'
    ),
    afterShipping: adjustments.filter(
      a => a.kind === 'credit' || a.kind === 'waived'
    ),
  };
}

// What this order drew on and what the member has left, for the
// confirmation page and the receipt. Read from the order's own record
// rather than the live balance, so it still reads true a week later.
export function describeBenefitUse(order: Order) {
  const use = order.benefit;
  if (!use) return null;

  const label =
    orderAdjustments(order).find(
      a => a.kind === 'credit' || a.kind === 'freeItem'
    )?.label ?? 'Your benefit';

  if (use.type === 'credit') {
    return `${label}: ${formatToMoney(
      use.used,
      true
    )} used on this order, ${formatToMoney(
      use.remainingAfter,
      true
    )} left to spend.`;
  }

  if (use.type === 'freeItem') {
    return `${label}: ${use.remainingAfter} free item${
      use.remainingAfter === 1 ? '' : 's'
    } left.`;
  }

  return null;
}

// A members-only store shows nothing but the sign-in card to anyone who has
// not verified. Eligibility does not matter here: a member who has used
// everything up can still see the store, they just pay full price.
export function membersOnlyLockout(view: BenefitView | null) {
  return !!view && view.access === 'members' && !view.member;
}

// What the card says about a signed-in member, in the three pieces it
// shows: a state, the number they came back for, and a line of context.
//
// A permanent check mark was doing this job badly. A check is a success
// signal for the moment an action completes; on every visit afterwards the
// member is not completing anything, they are looking for their balance,
// and the icon competed with it. A state does the same work in a word,
// reads the same for every type, and gives the paused and used-up states a
// marker of their own, which they had no way of showing before.
export type BenefitStatus = {
  tone: 'active' | 'spent' | 'paused';
  label: string;
  // The number, when there is one worth setting large.
  headline: string | null;
  detail: string;
};

export function benefitStatus(view: BenefitView): BenefitStatus | null {
  const member = view.member;
  if (!member) return null;

  if (member.reason === 'paused') {
    return {
      tone: 'paused',
      label: 'Paused',
      headline: null,
      detail: 'Please check back later.',
    };
  }

  if (member.reason === 'usedUp') {
    return {
      tone: 'spent',
      label: 'Used up',
      headline: null,
      detail: 'Anything else you order is at the regular price.',
    };
  }

  if (member.reason !== 'eligible') return null;

  switch (view.type) {
    case 'credit':
      return {
        tone: 'active',
        label: 'Active',
        headline: `${formatToMoney(member.remaining, true)} left`,
        detail: `of your ${formatToMoney(member.allowance, true)} credit.`,
      };
    case 'discount':
      return {
        tone: 'active',
        label: 'Active',
        headline: `${formatToMoney(member.remaining, true)} off`,
        detail: 'Applied at checkout.',
      };
    case 'freeItem':
      return {
        tone: 'active',
        label: 'Active',
        headline: `${member.remaining} free item${
          member.remaining === 1 ? '' : 's'
        } left`,
        detail:
          member.allowance > 1
            ? `of your ${member.allowance}.`
            : 'Add it to your cart and it costs nothing.',
      };
  }
}
