import React from 'react';
import {
  calculateCartSubtotal,
  calculateSalesTax,
  calculateCartTotal,
} from '../utils';
import { CartItem } from '../interfaces';
import useLocalStorage from './useLocalStorage';

type InitialState = {
  items: CartItem[];
  cartIsEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  cartSubtotal: number;
  salesTax: number;
  cartTotal: number;
};

interface CartProviderState extends InitialState {
  addItem: (item: CartItem, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateItemSize: (prevId: string, payload: CartItem) => void;
  updateItem: (id: string, payload: Record<string, unknown>) => void;
  updateItemQuantity: (id: string, quantity: number) => void;
  emptyCart: () => void;
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

const CartContext =
  React.createContext<CartProviderState | undefined>(initialState);

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
        if (item.sku.id !== action.id) return item;

        return {
          ...item,
          ...action.payload,
        };
      });

      return generateCartState(state, items);
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter(
        (item: CartItem) => item.sku.id !== action.id
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
  const cartSubtotal = calculateCartSubtotal(items);
  const salesTax = calculateSalesTax(cartSubtotal);

  return {
    ...initialState,
    ...state,
    items: cartItems,
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    cartSubtotal,
    salesTax,
    cartTotal: calculateCartTotal(cartSubtotal, salesTax),
    cartIsEmpty,
  };
};

const calculateUniqueItems = (items: CartItem[]) => items.length;

const calculateTotalItems = (items: CartItem[]) => {
  return items.reduce((sum, item) => sum + item.quantity!, 0);
};

const calculateItemTotals = (items: CartItem[]) => {
  return items.map(item => ({
    ...item,
    itemTotal: item.price * item.quantity!,
  }));
};

export function CartProvider({
  children,
  cartId,
}: {
  children: React.ReactNode;
  cartId: string;
}) {
  const [savedCart, saveCart] = useLocalStorage(
    cartId ? cartId : `cart-storage`,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(reducer, JSON.parse(savedCart));

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const setItems = (items: CartItem[]) => {
    dispatch({
      type: 'SET_ITEMS',
      payload: items,
    });
  };

  const addItem = (item: CartItem, quantity = 1) => {
    if (!item.sku.id) throw new Error('You must provide an `id` for items');
    if (quantity <= 0) return;

    const currentItem = state.items.find(
      (i: CartItem) => i.sku.id === item.sku.id
    );

    if (!currentItem) {
      const payload = { ...item, quantity };
      dispatch({ type: 'ADD_ITEM', payload });

      return;
    }

    const payload = { ...item, quantity: currentItem.quantity + quantity };

    dispatch({ type: 'UPDATE_ITEM', id: item.sku.id, payload });

    return;
  };

  const updateItemSize = (prevId: string, payload: Record<string, any>) => {
    if (!prevId || !payload || prevId === payload.id) return;

    const existingCartItem = state.items.find(
      (item: CartItem) => item.sku.id === payload.sku.id
    );

    if (existingCartItem) {
      dispatch({
        type: 'UPDATE_ITEM',
        id: `${payload.sku.id}`,
        payload: {
          quantity: existingCartItem.quantity + payload.quantity,
        },
      });
      removeItem(prevId);
    } else {
      dispatch({
        type: 'UPDATE_ITEM',
        id: prevId,
        payload: { ...payload, price: payload.sku.size.price },
      });
    }
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', id });

      return;
    }

    const currentItem = state.items.find(
      (item: CartItem) => item.sku.id === id
    );

    if (!currentItem) throw new Error('No such item to update');

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
