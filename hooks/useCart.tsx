import React from 'react';
import { CartItem, ShippingMethod } from '../interfaces';
import useLocalStorage from './useLocalStorage';

// The cart holds what is in it and how it will ship. It does not price
// anything: that is usePricedCart, which runs the same pipeline the server
// does. It used to compute a subtotal, tax and total here, and then again
// with a credit on top, and again in the checkout form and sidebar, and each
// of those could disagree with what the server charged.

type CartState = {
  items: CartItem[];
  shippingMethod: ShippingMethod;
};

interface CartProviderState extends CartState {
  cartIsEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
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
  setShippingMethod: (method: ShippingMethod) => void;
}

type Actions =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'UPDATE_ITEM'; id: string; payload: Record<string, unknown> }
  | { type: 'REMOVE_ITEM'; id: string }
  | { type: 'EMPTY_CART' }
  | { type: 'SET_SHIPPING_METHOD'; payload: ShippingMethod };

const initialState: CartState = {
  items: [],
  shippingMethod: 'Primary',
};

const CartContext = React.createContext<CartProviderState | undefined>(
  undefined
);

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) throw new Error('Expected to be wrapped in a CartProvider');
  return context;
};

function reducer(state: CartState, action: Actions): CartState {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: action.payload };
    case 'ADD_ITEM':
      return { ...state, items: [...state.items, action.payload] };
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.id ? { ...item, ...action.payload } : item
        ),
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.id),
      };
    case 'EMPTY_CART':
      return { ...initialState, shippingMethod: state.shippingMethod };
    case 'SET_SHIPPING_METHOD':
      return { ...state, shippingMethod: action.payload };
    default:
      throw new Error('No action specified');
  }
}

// Carts saved by the previous version carried computed totals and program
// flags alongside the items. Only the items and the shipping choice are
// kept; everything else is derived again.
function restore(saved: string): CartState {
  try {
    const parsed = JSON.parse(saved);
    const items: CartItem[] = Array.isArray(parsed?.items) ? parsed.items : [];
    const method = parsed?.shippingMethod;
    return {
      items: items.filter(item => item && item.id && item.quantity > 0),
      shippingMethod:
        method === 'Direct' || method === 'Store Pickup' || method === 'Primary'
          ? method
          : 'Primary',
    };
  } catch {
    return initialState;
  }
}

type CartProviderType = {
  children: React.ReactNode;
  cartId: string;
};

export function CartProvider({ children, cartId }: CartProviderType) {
  const [savedCart, saveCart] = useLocalStorage(
    cartId,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(reducer, savedCart, restore);

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const setItems = React.useCallback((items: CartItem[]) => {
    dispatch({ type: 'SET_ITEMS', payload: items });
  }, []);

  const addItem = React.useCallback(
    (item: CartItem) => {
      if (!item.id) throw new Error('You must provide an `id` for items');
      if (item.quantity <= 0) return;

      const currentItem = state.items.find((i: CartItem) => i.id === item.id);

      if (!currentItem) {
        dispatch({ type: 'ADD_ITEM', payload: item });
        return;
      }

      dispatch({
        type: 'UPDATE_ITEM',
        id: item.id,
        payload: { ...item, quantity: currentItem.quantity + item.quantity },
      });
    },
    [state.items]
  );

  const removeItem = React.useCallback((id: string) => {
    if (!id) return;
    dispatch({ type: 'REMOVE_ITEM', id });
  }, []);

  const updateItem = React.useCallback(
    (id: string, payload: Record<string, unknown>) => {
      dispatch({ type: 'UPDATE_ITEM', id, payload });
    },
    []
  );

  const updateItemSize = React.useCallback(
    (prevId: string, prevSkuId: string, payload: CartItem) => {
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
          payload: { quantity: updatedQuantity },
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
          payload: { ...payload, quantity: updatedQuantity },
        });
      }
    },
    [removeItem, state.items]
  );

  const updateItemQuantity = React.useCallback(
    (id: string, quantity: number) => {
      if (quantity <= 0) {
        dispatch({ type: 'REMOVE_ITEM', id });
        return;
      }

      const currentItem = state.items.find((item: CartItem) => item.id === id);

      if (!currentItem) throw new Error('No item found to update');

      dispatch({
        type: 'UPDATE_ITEM',
        id,
        payload: { ...currentItem, quantity },
      });
    },
    [state.items]
  );

  const emptyCart = React.useCallback(
    () => dispatch({ type: 'EMPTY_CART' }),
    []
  );

  const setShippingMethod = React.useCallback(
    (method: ShippingMethod) =>
      dispatch({ type: 'SET_SHIPPING_METHOD', payload: method }),
    []
  );

  const contextValue = React.useMemo(
    () => ({
      ...state,
      cartIsEmpty: state.items.length === 0,
      totalItems: state.items.reduce((sum, item) => sum + item.quantity, 0),
      totalUniqueItems: state.items.length,
      setItems,
      addItem,
      updateItem,
      updateItemSize,
      updateItemQuantity,
      removeItem,
      emptyCart,
      setShippingMethod,
    }),
    [
      state,
      setItems,
      addItem,
      updateItem,
      updateItemSize,
      updateItemQuantity,
      removeItem,
      emptyCart,
      setShippingMethod,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
