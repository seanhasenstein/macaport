import { Adjustment } from '../core/pricing/priceOrder';
import { BenefitView, Order } from '../interfaces';

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

// A members-only store shows nothing but the sign-in card to anyone who has
// not verified. Eligibility does not matter here: a member who has used
// everything up can still see the store, they just pay full price.
export function membersOnlyLockout(view: BenefitView | null) {
  return !!view && view.access === 'members' && !view.member;
}

// The figure a member sees on the card for each type: a credit is a
// balance, a discount is an amount off, a free item is a count.
export function describeRemaining(view: BenefitView) {
  const member = view.member;
  if (!member) return '';

  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  switch (view.type) {
    case 'credit':
      return `You have ${money(member.remaining)} of ${money(
        member.allowance
      )} left to spend.`;
    case 'discount':
      return `You have ${money(member.remaining)} off your order.`;
    case 'freeItem':
      return `You have ${member.remaining} free item${
        member.remaining === 1 ? '' : 's'
      } left.`;
  }
}
