import React from 'react';
import {
  calculateCartSubtotal,
  calculateTransactionFee,
  calculateCartTotal,
} from '../utils';
import { CartItem } from '../interfaces';
import useLocalStorage from './useLocalStorage';
import { string } from 'yup/lib/locale';

type InitialState = {
  items: CartItem[];
  cartIsEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  cartSubtotal: number;
  transactionFee: number;
  cartTotal: number;
};

interface CartProviderState extends InitialState {
  addItem: (item: CartItem, quantity?: number) => void;
  removeItem: (id: CartItem['id']) => void;
  updateItem: (id: CartItem['id'], payload: Record<string, unknown>) => void;
  updateItemQuantity: (id: CartItem['id'], quantity: number) => void;
  emptyCart: () => void;
}

type Actions =
  | { type: 'SET_ITEMS'; payload: CartItem[] }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | {
      type: 'UPDATE_ITEM';
      id: CartItem['id'];
      payload: Record<string, unknown>;
    }
  | { type: 'REMOVE_ITEM'; id: CartItem['id'] }
  | { type: 'EMPTY_CART' };

const initialState: any = {
  id: string,
  items: [],
  cartIsEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  cartSubtotal: 0,
  transactionFee: 0,
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
  const cartSubtotal = calculateCartSubtotal(items);
  const transactionFee = calculateTransactionFee(cartSubtotal);

  return {
    ...initialState,
    ...state,
    items: cartItems,
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    cartSubtotal,
    transactionFee,
    cartTotal: calculateCartTotal(cartSubtotal, transactionFee),
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

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [savedCart, saveCart] = useLocalStorage(
    'demo-cart-c895fafc',
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
    if (!item.id) throw new Error('You must provide an `id` for items');
    if (quantity <= 0) return;

    const currentItem = state.items.find((i: CartItem) => i.id === item.id);

    if (!currentItem && !Object.hasOwnProperty.call(item, 'price')) {
      throw new Error('You must pass a `price` for new items');
    }

    if (!currentItem) {
      const payload = { ...item, quantity };
      dispatch({ type: 'ADD_ITEM', payload });

      return;
    }

    const payload = { ...item, quantity: currentItem.quantity + quantity };

    dispatch({ type: 'UPDATE_ITEM', id: item.id, payload });

    return;
  };

  const updateItem = (id: CartItem['id'], payload: Record<string, unknown>) => {
    if (!id || !payload) return;

    // if payload includes size then the item.id will change
    // need to check if updated item.id is already in items
    if (payload.size) {
      const currentItem = state.items.find(
        (i: CartItem) => i.id === payload.id
      );

      if (!currentItem) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { prevId, ...itemPayload } = payload;

        dispatch({
          type: 'UPDATE_ITEM',
          id,
          payload: itemPayload,
        });
      } else {
        removeItem(`${payload.prevId}`);

        dispatch({
          type: 'UPDATE_ITEM',
          id: `${payload.id}`,
          payload: {
            quantity: currentItem.quantity + payload.quantity,
          },
        });
      }
    }
  };

  const updateItemQuantity = (id: CartItem['id'], quantity: number) => {
    if (quantity <= 0) {
      dispatch({ type: 'REMOVE_ITEM', id });

      return;
    }

    const currentItem = state.items.find((item: CartItem) => item.id === id);

    if (!currentItem) throw new Error('No such item to update');

    const payload = { ...currentItem, quantity };

    dispatch({
      type: 'UPDATE_ITEM',
      id,
      payload,
    });
  };

  const removeItem = (id: CartItem['id']) => {
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
        updateItem,
        updateItemQuantity,
        removeItem,
        emptyCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
