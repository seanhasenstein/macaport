import {
  CartItem,
  PersonalizationItem,
  StoreProduct,
  VerifyCartItemsAccumulator,
} from 'interfaces';

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
              itemTotal:
                inventoryAvailable *
                (productSku.size.price + verifiedPersonalizationTotal),
            },
          ],
        };
      }

      // at this point we know that there is enough productSku.invntory for this currentItem.quantity

      // OLD LOW_QUANTITY/OUT_OF_STOCK CODE
      // if (productSku.inventory < totalQuantity) {
      //   if (productSku.inventory === 0) {
      // return {
      //   ...cartAccumulator,
      //   itemsOutOfStock: [
      //     ...cartAccumulator.itemsOutOfStock,
      //     { ...currentItem, quantity: 0, itemTotal: 0 },
      //   ],
      // };
      //   }

      //   const updatedQuantity = totalQuantity - productSku.inventory;

      //   return {
      //     ...cartAccumulator,
      //     lowerInventoryItems: [
      //       ...cartAccumulator.lowerInventoryItems,
      //       {
      //         ...currentItem,
      //         quantity: updatedQuantity,
      //         itemTotal:
      //           updatedQuantity *
      //           (productSku.size.price + verifiedPersonalizationTotal),
      //       },
      //     ],
      //   };
      // }

      const itemPrice = productSku.size.price + verifiedPersonalizationTotal;

      // TODO
      // const { active, inventory, ...updatedSku } = currentItem.sku;
      // const {active, inventory, ...updatedProductSku} = productSku;

      const verifiedItem = {
        ...currentItem,
        sku: productSku,
        merchandiseCode: product.merchandiseCode,
        price: itemPrice,
        itemTotal: itemPrice * currentItem.quantity!,
      };

      const verifiedSubtotal =
        cartAccumulator.subtotal + verifiedItem.itemTotal;

      return {
        ...cartAccumulator,
        items: [...cartAccumulator.items, verifiedItem],
        subtotal: verifiedSubtotal,
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
