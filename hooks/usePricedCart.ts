import React from 'react';

import {
  Adjustment,
  PriceLine,
  priceOrder,
  PricedOrder,
} from '../core/pricing/priceOrder';
import { SALES_TAX_RATE } from '../utils';
import { BenefitView, CartItem } from '../interfaces';
import { useCart } from './useCart';

export interface PricedCartItem extends CartItem {
  itemTotal: number;
  // Anything that changed this line's price, such as a free item.
  adjustments: Adjustment[];
}

export interface PricedCart extends PricedOrder {
  items: PricedCartItem[];
  // How many garments in the cart a free-item benefit is currently
  // covering. The product page uses it to know whether one more would be.
  freeUnitsInCart: number;
}

// The cart, priced the way the server will price it.
//
// Same pipeline, same inputs, so the totals on the cart page, the checkout
// page and the submit button are the number Stripe is asked for. The benefit
// comes from the page's server-rendered props, never from browser state, and
// shipping data is passed by the pages that have it (checkout) and left out
// by the one that does not (cart), where shipping shows as "calculated next".
export function usePricedCart(
  benefit: BenefitView | null,
  shipping: { price: number; freeMinimum: number } | null
): PricedCart {
  const cart = useCart();

  return React.useMemo(() => {
    const priced = priceOrder({
      lines: cart.items.map(toPriceLine),
      benefit: benefit?.member?.forPricing ?? null,
      taxRate: SALES_TAX_RATE,
      shipping: {
        method: cart.shippingMethod,
        price: shipping?.price ?? 0,
        freeMinimum: shipping?.freeMinimum ?? 0,
      },
    });

    const items = cart.items.map(item => {
      const line = priced.lines.find(l => l.id === item.id);
      return {
        ...item,
        itemTotal: line ? line.lineTotal : item.price * item.quantity,
        adjustments: line ? line.adjustments : [],
      };
    });

    const freeUnitsInCart = priced.adjustments.reduce(
      (sum, a) => sum + (a.kind === 'freeItem' ? a.units ?? 0 : 0),
      0
    );

    return { ...priced, items, freeUnitsInCart };
  }, [cart.items, cart.shippingMethod, benefit, shipping]);
}

// A cart item's price is the garment plus its add-ons per unit. The
// pipeline wants them apart, because a free item covers the garment and not
// the name printed on it. Items saved by older versions of the cart may lack
// a personalization total, and the free-shirt hack used to zero the price,
// so both are clamped: the server re-prices every line from the database
// regardless, and this only has to not throw.
function toPriceLine(item: CartItem): PriceLine {
  const addOn = Math.max(0, Math.round(item.personalizationTotal ?? 0));
  const unit = Math.max(0, Math.round(item.price ?? 0) - addOn);

  return {
    id: item.id,
    unitPrice: unit,
    addOnUnitPrice: addOn,
    quantity: Math.max(1, Math.round(item.quantity)),
    productId: item.sku?.storeProductId,
  };
}
