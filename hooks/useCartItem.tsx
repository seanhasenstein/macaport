import React from 'react';
import { CartItem, ProductSku } from 'interfaces';
import { createId } from 'utils';

interface Params {
  cartItem: CartItem;
  skus: ProductSku[];
  updateItemSize: (
    prevId: string,
    prevSkuId: string,
    payload: CartItem
  ) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
}

export default function useCartItem(params: Params) {
  const [size, setSize] = React.useState(params.cartItem.sku.size.label);
  const [quantity, setQuantity] = React.useState(params.cartItem.quantity);

  React.useEffect(() => {
    setSize(params.cartItem.sku.size.label);
    setQuantity(params.cartItem.quantity);
  }, [params.cartItem]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sku = params.skus.find(
      sku =>
        sku.size.label === e.target.value &&
        sku.color.label === params.cartItem.sku.color.label
    );

    if (sku) {
      setSize(sku.size.label);
      params.updateItemSize(params.cartItem.id, params.cartItem.sku.id, {
        ...params.cartItem,
        id: `${sku.id}-${createId(false, 5)}`,
        sku,
        quantity,
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    params.updateItemQuantity(params.cartItem.id, newQuantity);
  };

  const isSizeOutOfStock = (items: CartItem[], sku: ProductSku) => {
    const currentSize = sku.size.label === size;
    const updatedInventory = items.reduce((inventory, currentItem) => {
      if (currentItem.sku.id === sku.id) {
        return inventory - currentItem.quantity;
      }
      return inventory;
    }, sku.inventory);

    if (updatedInventory < 1 && !currentSize) {
      return true;
    }

    return false;
  };

  const isOptionDisabled = (
    items: CartItem[],
    cartItem: CartItem,
    optionValue: number
  ) => {
    const cartQuantity = items.reduce((cartQuantity, currentCartItem) => {
      if (currentCartItem.sku.id === cartItem.sku.id) {
        return cartQuantity + currentCartItem.quantity;
      }
      return cartQuantity;
    }, 0);

    if (
      optionValue >
      cartItem.quantity + (cartItem.sku.inventory - cartQuantity)
    ) {
      return true;
    }

    return false;
  };

  return {
    size,
    quantity,
    handleSizeChange,
    handleQuantityChange,
    isSizeOutOfStock,
    isOptionDisabled,
  };
}
