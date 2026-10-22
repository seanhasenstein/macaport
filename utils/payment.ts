import {
  CartItem,
  OrderItem,
  PersonalizationItem,
  StoreProduct,
  VerifyCartItemsAccumulator,
} from 'interfaces';

// Re-prices every cart line from the store's own products and checks stock.
//
// Nothing the browser sent about money survives this: the unit price comes
// from the sku, the personalization total from the store's add-on list, and
// the line total from those two. What it does not do is apply any benefit.
// That happens afterwards in core/pricing/priceOrder, on the lines this
// returns, which is why a free item no longer arrives as a zero-priced line
// the server has to guess at.
export function verifyCartItems(
  items: CartItem[],
  verifiedStoreProducts: StoreProduct[]
) {
  return items.reduce(
    (cartAccumulator: VerifyCartItemsAccumulator, currentItem: CartItem) => {
      const product = verifiedStoreProducts.find(
        p => p.id === currentItem.sku.storeProductId
      );

      const productSku = product?.productSkus.find(
        ps => ps.id === currentItem.sku.id
      );

      if (!product || !productSku) {
        return {
          ...cartAccumulator,
          itemsOutOfStock: [
            ...cartAccumulator.itemsOutOfStock,
            { ...currentItem, quantity: 0, itemTotal: 0 },
          ],
        };
      }

      // finds items with same sku.id that are already in the cartAccumulator
      const verifiedSkuItems = cartAccumulator.items.filter(
        vi => vi.sku.id === currentItem.sku.id
      );

      // loop over verifiedItems and add quantity to the currentItem's quantity
      // to get the "totalQuantity" for this sku
      const totalVerifiedSkuItemsQuantity = verifiedSkuItems.reduce(
        (total, currentVerifiedItem) => currentVerifiedItem.quantity + total,
        0
      );

      const verifiedPersonalizationTotal =
        currentItem.personalizationAddons.reduce(
          (accumulator, currentAddon) => {
            const baseItem: PersonalizationItem | undefined =
              product.personalization.addons.find(
                dbAddon => dbAddon.id === currentAddon.itemId
              );

            if (baseItem) {
              const subItemsTotal = currentAddon.subItems.reduce(
                (subItemsAcc, currSubItem) => {
                  const subItem: PersonalizationItem | undefined =
                    baseItem.subItems.find(
                      subItem => subItem.id === currSubItem.itemId
                    );

                  if (subItem) {
                    return subItemsAcc + subItem.price;
                  }

                  return subItemsAcc;
                },
                0
              );

              return accumulator + baseItem.price + subItemsTotal;
            }

            return accumulator;
          },
          0
        );

      // IF productSku.inventory <= verifiedItems total quantity
      //
      //   THEN there is no more inventory available (remove current item completely => add to itemsOutOfStock [])
      // IF productSku.inventory > verifiedItems total quantity
      //    IF currentItem.quantity > (productSku.inventory - verifiedItems total quantity)
      //          THEN currentItems is a lowInventoryItem and quantity should be set to productSku.inventory - verifiedItems total quantity
      // OTHERWISE add the currentItem to items and update the other necessary accumulator fields (subtotal)

      // there's no inventory left for this currentItem.quantity so add it to itemsOutOfStock
      if (productSku.inventory <= totalVerifiedSkuItemsQuantity) {
        return {
          ...cartAccumulator,
          itemsOutOfStock: [
            ...cartAccumulator.itemsOutOfStock,
            { ...currentItem, quantity: 0, itemTotal: 0 },
          ],
        };
      }

      // to get to this point that means there's inventory available
      // but we still don't know if there's enough for the currentItem.quantity

      // there is inventory available but not enough for this currentItem
      // so we add the currentItem to lowerInventoryItems with the quantity that's still available
      if (productSku.inventory < currentItem.quantity) {
        const inventoryAvailable =
          productSku.inventory - totalVerifiedSkuItemsQuantity;

        return {
          ...cartAccumulator,
          lowerInventoryItems: [
            ...cartAccumulator.lowerInventoryItems,
            {
              ...currentItem,
              quantity: inventoryAvailable,
              sku: productSku,
              price: productSku.size.price + verifiedPersonalizationTotal,
              personalizationTotal: verifiedPersonalizationTotal,
              itemTotal:
                inventoryAvailable *
                (productSku.size.price + verifiedPersonalizationTotal),
            },
          ],
        };
      }

      // at this point we know that there is enough productSku.inventory for this currentItem.quantity

      const itemPrice = productSku.size.price + verifiedPersonalizationTotal;

      const verifiedItem: OrderItem = {
        ...currentItem,
        sku: productSku,
        merchandiseCode: product.merchandiseCode,
        price: itemPrice,
        personalizationTotal: verifiedPersonalizationTotal,
        itemTotal: itemPrice * currentItem.quantity,
        status: {
          current: 'Unfulfilled',
          meta: {
            Unfulfilled: {
              user: 'system',
              updatedAt: new Date().toISOString(),
            },
          },
        },
      };

      return {
        ...cartAccumulator,
        items: [...cartAccumulator.items, verifiedItem],
        subtotal: cartAccumulator.subtotal + verifiedItem.itemTotal!,
      };
    },
    {
      items: [],
      lowerInventoryItems: [],
      itemsOutOfStock: [],
      subtotal: 0,
    }
  );
}
