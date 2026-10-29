import { normalizeEmail } from '../core/memberBenefits/eligibility';
import { Adjustment } from '../core/pricing/priceOrder';
import {
  BenefitView,
  Order,
  PersonalizationItem,
  StoreProduct,
} from '../interfaces';
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
//
// Two labelled values rather than one sentence: the summary it sits under
// is already a column of labels and amounts, and "1 free item used on this
// order, none left" asked the reader to parse a clause to find each number.
export type BenefitUseSummary = {
  label: string;
  used: string;
  remaining: string;
};

export function summarizeBenefitUse(order: Order): BenefitUseSummary | null {
  const use = order.benefit;
  if (!use) return null;

  const label =
    orderAdjustments(order).find(
      a => a.kind === 'credit' || a.kind === 'freeItem'
    )?.label ?? 'Your benefit';

  if (use.type === 'credit') {
    return {
      label,
      used: formatToMoney(use.used, true),
      remaining:
        use.remainingAfter > 0
          ? formatToMoney(use.remainingAfter, true)
          : 'None',
    };
  }

  if (use.type === 'freeItem') {
    const items = (n: number) => `${n} item${n === 1 ? '' : 's'}`;
    return {
      label,
      used: items(use.used),
      remaining: use.remainingAfter > 0 ? items(use.remainingAfter) : 'None',
    };
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
  // What the number means, set small beside it. Kept out of the headline
  // so the amount always leads and a long pair cannot push it onto two
  // lines of large type.
  note: string | null;
  detail: string;
};

// Why a line carrying a free item still has a price on it.
//
// This is the one place in the flow where the screen contradicts itself to
// a reader: a badge saying the item is free, directly beside an amount they
// are being charged. The prices alone answer it only if you subtract them,
// which nobody scanning a cart does.
export const FREE_ITEM_NOTE =
  'Your free item covers the garment. Add-ons are charged.';

// A free item covers whole garments, and a benefit may cover fewer of them
// than the line holds. Three shirts with one free leaves a charge that is two
// more shirts, not printing, and saying "add-ons are charged" there is simply
// untrue. So the note appears only once every garment on the line is covered
// and a charge still remains, which by construction can only be add-ons: if
// there were none, a fully covered line would come to nothing.
export function needsFreeItemNote(
  itemTotal: number,
  adjustments: Adjustment[],
  quantity: number
) {
  if (itemTotal <= 0) return false;
  const covered = adjustments
    .filter(adjustment => adjustment.kind === 'freeItem')
    .reduce((sum, adjustment) => sum + (adjustment.units ?? 0), 0);
  return covered > 0 && covered >= quantity;
}

// An add-on that costs money, anywhere in the tree. A personalization item
// can carry sub-items, and only one of them needs a price for a free item
// to still ring up.
function hasPrice(item: PersonalizationItem): boolean {
  if ((item.price ?? 0) > 0) return true;
  return (item.subItems ?? []).some(hasPrice);
}

// Whether a free item can still cost the member something: true when any
// product this benefit covers sells a priced add-on. That is what makes a
// line marked free arrive with a price on it, and it is the only case where
// the card needs to say so. A store with no personalization never raises
// the question, so the card does not answer it.
//
// A null productIds means the benefit covers the whole store; an empty one
// covers nothing, which falls out of the same test.
export function benefitCoversPaidAddons(
  benefit: Pick<BenefitView, 'productIds'>,
  products: StoreProduct[]
): boolean {
  return products
    .filter(p => !benefit.productIds || benefit.productIds.includes(p.id))
    .some(
      p =>
        !!p.personalization?.active &&
        (p.personalization.addons ?? []).some(hasPrice)
    );
}

// paidAddons defaults to true so a caller that cannot answer the question
// keeps the fuller sentence. Saying "add-ons are extra" where none exist is
// merely noise; dropping it where they do exist is a surprise at checkout.
// How the benefit works, in the two or three facts people ask about. The
// signed-out card shows it under the button; signed in it is the panel's
// second line, because that is where the information went when the sign-in
// form disappeared.
export function benefitTerms(view: BenefitView, paidAddons = true) {
  switch (view.type) {
    // Each one leads with what the member can do and closes on what it
    // reaches. Opening on tax and shipping read as the limit of the
    // benefit rather than as something extra it covers.
    case 'credit':
      return 'Use it across as many orders as you like. Tax and shipping included.';
    // Not "tax not included": a discount comes off the items before tax is
    // worked out, so it lowers the tax too. What it does not do is pay for
    // shipping.
    case 'discount':
      return 'Use it on a single order. It comes off your items, not your shipping.';
    // The second sentence only earns its place where an add-on can actually
    // be charged.
    case 'freeItem':
      return paidAddons
        ? 'Add it to your cart at no charge. Printed names and other add-ons are extra.'
        : 'Add it to your cart at no charge.';
  }
}

export function benefitStatus(
  view: BenefitView,
  paidAddons = true
): BenefitStatus | null {
  const member = view.member;
  if (!member) return null;

  if (member.reason === 'paused') {
    return {
      tone: 'paused',
      label: 'Paused',
      headline: null,
      note: null,
      detail: 'Please check back later.',
    };
  }

  if (member.reason === 'usedUp') {
    return {
      tone: 'spent',
      // The one word for "there is none of this left" is different for
      // each type, and a member only ever sees one of them. "Redeemed" is
      // avoided throughout: in this flow it collides with the "activate"
      // button they just pressed.
      label:
        view.type === 'credit'
          ? 'Spent'
          : view.type === 'discount'
          ? 'Already used'
          : 'Claimed',
      headline: null,
      note: null,
      detail: 'Anything else you order is at the regular price.',
    };
  }

  if (member.reason !== 'eligible') return null;

  switch (view.type) {
    // Both figures go on the number line, so the line under it is free to
    // say how the thing works rather than repeating a total. Before any of
    // it is spent there is no second figure worth printing.
    case 'credit':
      return {
        tone: 'active',
        label: 'Active',
        headline: formatToMoney(member.remaining, true),
        note:
          member.remaining === member.allowance
            ? 'to spend'
            : `left of ${formatToMoney(member.allowance, true)}`,
        detail: benefitTerms(view, paidAddons),
      };
    case 'discount':
      return {
        tone: 'active',
        label: 'Active',
        headline: formatToMoney(member.remaining, true),
        note: 'off your order',
        detail: benefitTerms(view, paidAddons),
      };
    case 'freeItem':
      return {
        tone: 'active',
        label: 'Active',
        headline: `${member.remaining} free item${
          member.remaining === 1 ? '' : 's'
        }`,
        note:
          member.remaining === member.allowance
            ? null
            : `of your ${member.allowance}`,
        detail: benefitTerms(view, paidAddons),
      };
  }
}

// At checkout the email field is prefilled with the verified member's
// address but stays editable, because people do want the receipt somewhere
// else: a personal address rather than a work one, or a parent paying for a
// staff member. Changing it moves nothing. The server reads the benefit
// from the signed session cookie, never from this field, so the allowance
// is still drawn from the verified member and the receipt is the only thing
// that follows what is typed here. Without a word of explanation the
// shopper has to guess which address the benefit follows, and the safe
// guess is to put the old one back.
//
// Returns null when there is nothing to say: no verified member, an empty
// field, or an address that still matches once case and spacing are
// ignored.
export function benefitEmailNote(
  verifiedEmail: string | null | undefined,
  typedEmail: string | null | undefined,
  benefitName: string | null | undefined,
  // Whether the benefit is actually going to do anything on this order. A
  // member whose credit is spent, or whose benefit is paused, still has a
  // verified session and a prefilled email, and telling them their credit
  // "stays with" that address implies they still have one. The card on the
  // store page says SPENT; this must not contradict it.
  eligible: boolean
): string | null {
  if (!eligible) return null;
  if (!verifiedEmail || !benefitName) return null;
  const typed = normalizeEmail(typedEmail ?? '');
  if (!typed) return null;
  if (typed === normalizeEmail(verifiedEmail)) return null;
  return `Your ${benefitName} stays with ${verifiedEmail}. Your receipt will go to this address.`;
}
