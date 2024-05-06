import { CartItem, ProductColor, ProductSize, ProductSku } from 'interfaces';
import React from 'react';
import { defaultSize } from 'utils/store';

interface Params {
  cartItems: CartItem[];
  productSkus: ProductSku[];
  selectedColor: ProductColor;
  eligibleForFreeShirt: boolean;
}

export default function useStoreProductSize(params: Params) {
  const [size, setSize] = React.useState<ProductSize>(defaultSize);
  const [sizeValidationError, setSizeValidationError] =
    React.useState<string>();
  const [lowInventory, setLowInventory] = React.useState(false);

  // don't display low inventory message when there isn't a size selected
  React.useEffect(() => {
    if (size.label === 'DEFAULT') {
      setLowInventory(false);
    }
  }, [size]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (sizeValidationError && e.target.value !== undefined) {
      setSizeValidationError(undefined);
    }

    const productSku = params.productSkus.find(
      ps =>
        ps.size.label === e.target.value &&
        ps.color.id === params.selectedColor.id
    );

    if (!productSku) {
      // TODO: do we really want to throw an error here?
      // what else could we do?
      throw new Error('No size was found.');
    }

    // look for productSku in cartItems and subtract from db inventory
    const cartItem = params.cartItems.find(
      cartItem => cartItem.sku.id === productSku.id
    );
    const cartItemQuantity = cartItem?.quantity || 0;
    const combinedInventory = productSku.inventory - cartItemQuantity;

    setLowInventory(combinedInventory < 3);

    const sizeCheckForFreeShirt: ProductSize = params.eligibleForFreeShirt
      ? { ...productSku.size, price: 0 }
      : productSku.size;

    setSize(sizeCheckForFreeShirt);
  };

  return {
    size,
    setSize,
    sizeValidationError,
    setSizeValidationError,
    lowInventory,
    setLowInventory,
    handleSizeChange,
  };
}
