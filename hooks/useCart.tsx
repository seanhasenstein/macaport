import React from 'react';
import {
  calculateCartSubtotal,
  calculateSalesTax,
  calculateCartTotal,
  calculateShipping,
} from '../utils';
import { CartItem, ShippingMethod } from '../interfaces';
import useLocalStorage from './useLocalStorage';

interface ShippingPayload {
  price: number;
  freeMinimum: number;
  shippingMethod: ShippingMethod;
}

type InitialState = {
  id: string;
  items: CartItem[];
  cartIsEmpty: boolean;
  totalItems: number;
  totalUniqueItems: number;
  cartSubtotal: number;
  salesTax: number;
  shipping: number;
  cartTotalWithoutShipping: number;
  cartTotal: number;
  isSwitchFitnessStore: boolean;
  applySwitchFitnessDiscount: boolean;
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
  updateShipping: (payload: ShippingPayload) => void;
  updateStoreSettings: (settings: {
    isSwitchFitnessStore?: boolean;
    applySwitchFitnessDiscount?: boolean;
  }) => void;
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
  | { type: 'EMPTY_CART' }
  | { type: 'UPDATE_SHIPPING'; payload: ShippingPayload }
  | {
      type: 'UPDATE_STORE_SETTINGS';
      payload: {
        isSwitchFitnessStore?: boolean;
        applySwitchFitnessDiscount?: boolean;
      };
    };

const initialState: any = {
  id: '',
  items: [],
  cartIsEmpty: true,
  totalItems: 0,
  totalUniqueItems: 0,
  cartSubtotal: 0,
  salesTax: 0,
  cartTotalWithoutShipping: 0,
  cartTotal: 0,
  shipping: 0,
  isSwitchFitnessStore: false,
  applySwitchFitnessDiscount: false,
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
    case 'UPDATE_SHIPPING': {
      const { price, freeMinimum, shippingMethod } = action.payload;
      return generateCartState(state, state.items, {
        price,
        freeMinimum,
        shippingMethod,
      });
    }
    case 'UPDATE_STORE_SETTINGS':
      return {
        ...state,
        ...action.payload,
      };
    default:
      throw new Error('No action specified');
  }
}

const defaultShippingData: ShippingPayload = {
  price: 0,
  freeMinimum: 0,
  shippingMethod: 'Primary', // todo: figure out what to do when adding in-store and custom shipping methods
};

const generateCartState = (
  state = initialState,
  items: CartItem[],
  shippingData = defaultShippingData
) => {
  const applySwitchFitnessDiscount =
    state.isSwitchFitnessStore && state.applySwitchFitnessDiscount;
  const totalUniqueItems = calculateUniqueItems(items);
  const cartIsEmpty = totalUniqueItems === 0;
  const cartItems = calculateItemTotals(items);
  const { cartSubtotal, rawCartSubtotal } = calculateCartSubtotal({
    cartItems,
    applySwitchFitnessDiscount,
  });
  const salesTax = calculateSalesTax(cartSubtotal);
  const shipping = calculateShipping(
    shippingData.price,
    shippingData.freeMinimum,
    cartSubtotal,
    shippingData.shippingMethod
  );
  const cartTotalWithoutShipping = calculateCartTotal(
    cartSubtotal,
    salesTax,
    0
  );
  const cartTotal = calculateCartTotal(cartSubtotal, salesTax, shipping);

  return {
    // ...initialState,
    ...state,
    items: cartItems,
    totalItems: calculateTotalItems(items),
    totalUniqueItems,
    cartSubtotal: rawCartSubtotal,
    salesTax,
    shipping,
    cartTotalWithoutShipping,
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
  const [savedCart, saveCart] = useLocalStorage(
    cartId,
    JSON.stringify(initialState)
  );
  const [state, dispatch] = React.useReducer(reducer, JSON.parse(savedCart));

  React.useEffect(() => {
    saveCart(JSON.stringify(state));
  }, [state, saveCart]);

  const updateStoreSettings = React.useCallback(
    (settings: {
      isSwitchFitnessStore?: boolean;
      applySwitchFitnessDiscount?: boolean;
    }) => {
      dispatch({ type: 'UPDATE_STORE_SETTINGS', payload: settings });
    },
    []
  );

  const setItems = React.useCallback((items: CartItem[]) => {
    dispatch({
      type: 'SET_ITEMS',
      payload: items,
    });
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

      const payload = {
        ...item,
        quantity: currentItem.quantity + item.quantity,
      };
      dispatch({ type: 'UPDATE_ITEM', id: item.id, payload });
      return;
    },
    [state.items]
  );

  const removeItem = React.useCallback((id: string) => {
    if (!id) return;

    dispatch({ type: 'REMOVE_ITEM', id });
  }, []);

  const updateItemSize = React.useCallback(
    (prevId: string, prevSkuId: string, payload: Record<string, any>) => {
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
            quantity: updatedQuantity,
          },
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

      const payload = { ...currentItem, quantity };

      dispatch({
        type: 'UPDATE_ITEM',
        id,
        payload,
      });
    },
    [state.items]
  );

  const emptyCart = React.useCallback(
    () => dispatch({ type: 'EMPTY_CART' }),
    []
  );

  const updateShipping = React.useCallback(
    (payload: ShippingPayload) =>
      dispatch({ type: 'UPDATE_SHIPPING', payload }),
    []
  );

  const contextValue = React.useMemo(
    () => ({
      ...state,
      setItems,
      addItem,
      updateItemSize,
      updateItemQuantity,
      removeItem,
      emptyCart,
      updateShipping,
      updateStoreSettings,
    }),
    [
      state,
      setItems,
      addItem,
      updateItemSize,
      updateItemQuantity,
      removeItem,
      emptyCart,
      updateShipping,
      updateStoreSettings,
    ]
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
