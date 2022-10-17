import React from 'react';
import { useRouter } from 'next/router';
import { getUrlParameter } from 'utils';
import { CartItem, ProductColor, ProductSku } from 'interfaces';

interface Params {
  productColors: ProductColor[];
  showSidebar: boolean;
  productSkus: ProductSku[];
  cartItems: CartItem[];
}

export default function useStoreProductColor(params: Params) {
  const router = useRouter();
  const [color, setColor] = React.useState(() => {
    if (router.query.colorId) {
      const colorId = getUrlParameter(router.query.colorId);
      const verifiedColor = params.productColors.find(c => c.id === colorId);
      return verifiedColor || params.productColors[0];
    } else {
      return params.productColors[0];
    }
  });
  const [colorOutOfStock, setColorOutOfStock] = React.useState(false);

  React.useEffect(() => {
    if (!params.showSidebar) {
      const colorStockCheck = params.productSkus.every(ps => {
        if (ps.color.id !== color.id) return true;
        const cartItem = params.cartItems.find(i => i.sku.id === ps.id);
        const cartItemInventory = cartItem?.quantity || 0;
        if (ps.inventory - cartItemInventory <= 0) {
          return true;
        }
        return false;
      });

      setColorOutOfStock(colorStockCheck);
    }
  }, [color.id, params.cartItems, params.productSkus, params.showSidebar]);

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedColor =
      params.productColors.find(c => c.id === e.target.value) ||
      params.productColors[0];
    setColor(updatedColor);
  };

  return { color, colorOutOfStock, handleColorChange };
}
