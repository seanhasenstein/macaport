import React from 'react';
// import { useRouter } from 'next/router';
import {
  calculateCartSubtotal,
  calculateSalesTax,
  calculateCartTotal,
} from '../utils';
import { CartItem } from '../interfaces';
import useLocalStorage from './useLocalStorage';

type InitialState = {
  id: string;
  items: CartItem[];
  cartIsEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  cartSubtotal: number;
  salesTax: number;
  cartTotal: number;
};

interface CartProviderState extends InitialState {
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateItemSize: (
    prevId: string,
    prevSkuId: string,
    payload: CartItem
  ) => void;
  updateItem: (id: string, payload: Record<string, unknown>) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  emptyCart: () => void;
  setItems: (items: CartItem[]) => void;
}

type Actions =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | {
      type: 'UPDATE_ITEM';
      id: string;
      payload: Record<string, unknown>;
    }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'EMPTY_CART' };

const initialState: any = {
  id: '',
  items: [],
  cartIsEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  cartSubtotal: 0,
  salesTax: 0,
  cartTotal: 0,
};

const CartContext = React.createContext<CartProviderState | undefined>(
  initialState
);

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) throw new Error('Expected to be wrapped in a CartProvider');
  return context;
};

function reducer(state: CartProviderState, action: Actions) {
  switch (action.type) {
    case 'SET_ITEMS':
      return generateCartState(state, action.payload);
    case 'ADD_ITEM': {
      const items = [...state.items, action.payload];

      return generateCartState(state, items);
    }
    case 'UPDATE_ITEM': {
      const items = state.items.map((item: CartItem) => {
        if (item.id !== action.id) return item;
        return {
          ...item,
          ...action.payload,
        };
      });

      return generateCartState(state, items);
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(
        (item: CartItem) => item.id !== action.id
      );

      return generateCartState(state, items);
    }
    case 'EMPTY_CART':
      return initialState;
    default:
      throw new Error('No action specified');
  }
}

const generateCartState = (state = initialState, items: CartItem[]) => {
  const totalUniqueItems = calculateUniqueItems(items);
  const cartIsEmpty = totalUniqueItems === 0;
  const cartItems = calculateItemTotals(items);
  const cartSubtotal = calculateCartSubtotal(cartItems);
  const salesTax = calculateSalesTax(cartSubtotal);
  const cartTotal = calculateCartTotal(cartSubtotal, salesTax);

  return {
    ...initialState,
    ...state,
    items: cartItems,
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    cartSubtotal,
    salesTax,
    cartTotal,
    cartIsEmpty,
  };
};

const calculateUniqueItems = (items: CartItem[]) => items.length;

const calculateTotalItems = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity, 0);
};

const calculateItemTotals = (items: CartItem[]) => {
  return items.map(item => ({
    ...item,
    itemTotal: item.price * item.quantity,
  }));
};

type CartProviderType = {
  children: React.ReactNode;
  cartId: string;
};

export function CartProvider({ children, cartId }: CartProviderType) {
  // const router = useRouter();
  const [savedCart, saveCart] = useLocalStorage(
    cartId,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(reducer, JSON.parse(savedCart));

  // React.useEffect(() => {
  //   // check if fetched product is active and has inventory
  //   async function fetchProducts() {
  //     function validateSavedCart(
  //       localStorageCart: string,
  //       fetchedProducts: StoreProduct[]
  //     ) {
  //       const parsedCart: InitialState = JSON.parse(localStorageCart);

  //       // update parsedCart inventory with inventory from db
  //       return parsedCart.items.reduce(
  //         (accumulator: CartItem[], currentCartItem) => {
  //           const fetchedProduct = fetchedProducts.find(
  //             fp => fp.id === currentCartItem.sku.storeProductId
  //           );
  //           const fetchedSku = fetchedProduct?.productSkus.find(
  //             ps => ps.id === currentCartItem.sku.id
  //           );

  //           if (
  //             !fetchedProduct ||
  //             !fetchedSku ||
  //             fetchedSku.inventory - currentCartItem.quantity < 0
  //           )
  //             return accumulator;

  //           let updatedQuantity = currentCartItem.quantity;

  //           if (currentCartItem.quantity > fetchedSku.inventory) {
  //             updatedQuantity = fetchedSku.inventory;
  //           }

  //           return [
  //             ...accumulator,
  //             {
  //               ...currentCartItem,
  //               quantity: updatedQuantity,
  //               sku: {
  //                 ...currentCartItem.sku,
  //                 inventory: fetchedSku?.inventory,
  //               },
  //             },
  //           ];
  //         },
  //         []
  //       );
  //     }

  //     const response = await fetch(`/api/store?id=${router.query.id}`);

  //     if (!response.ok) {
  //       throw new Error('Failed to fetch the store.');
  //     }

  //     const data: Store = await response.json();

  //     dispatch({
  //       type: 'SET_ITEMS',
  //       payload: validateSavedCart(savedCart, data.products),
  //     });
  //   }

  //   fetchProducts();
  // }, [router.query.id, savedCart]);

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const setItems = (items: CartItem[]) => {
    dispatch({
      type: 'SET_ITEMS',
      payload: items,
    });
  };

  const addItem = (item: CartItem) => {
    if (!item.id) throw new Error('You must provide an `id` for items');
    if (item.quantity <= 0) return;

    const currentItem = state.items.find((i: CartItem) => i.id === item.id);

    if (!currentItem) {
      dispatch({ type: 'ADD_ITEM', payload: item });
      return;
    }

    const payload = { ...item, quantity: currentItem.quantity + item.quantity };
    dispatch({ type: 'UPDATE_ITEM', id: item.id, payload });
    return;
  };

  const updateItemSize = (
    prevId: string,
    prevSkuId: string,
    payload: Record<string, any>
  ) => {
    if (!prevId || !payload) return;

    const existingCartItem = state.items.find(
      (item: CartItem) => item.id === payload.id
    );

    if (existingCartItem) {
      // same item (user opened select and kept the same size)
      if (prevSkuId === payload.sku.id) {
        return;
      }

      let updatedQuantity = existingCartItem.quantity + payload.quantity;

      if (updatedQuantity > payload.sku.inventory) {
        updatedQuantity = payload.sku.inventory;
      }

      dispatch({
        type: 'UPDATE_ITEM',
        id: `${payload.id}`,
        payload: {
          quantity: updatedQuantity,
        },
      });
      removeItem(prevId);
    } else {
      let updatedQuantity = payload.quantity;

      if (updatedQuantity > payload.sku.inventory) {
        updatedQuantity = payload.sku.inventory;
      }

      dispatch({
        type: 'UPDATE_ITEM',
        id: prevId,
        payload: {
          ...payload,
          price: payload.sku.size.price,
          quantity: updatedQuantity,
        },
      });
    }
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', id });
      return;
    }

    const currentItem = state.items.find((item: CartItem) => item.id === id);

    if (!currentItem) throw new Error('No item found to update');

    const payload = { ...currentItem, quantity };

    dispatch({
      type: 'UPDATE_ITEM',
      id,
      payload,
    });
  };

  const removeItem = (id: string) => {
    if (!id) return;

    dispatch({ type: 'REMOVE_ITEM', id });
  };

  const emptyCart = () => dispatch({ type: 'EMPTY_CART' });

  return (
    <CartContext.Provider
      value={{
        ...state,
        setItems,
        addItem,
        updateItemSize,
        updateItemQuantity,
        removeItem,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
