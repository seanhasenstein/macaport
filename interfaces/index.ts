import React from 'react';
import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';
import { Stripe, StripeCardElementChangeEvent } from '@stripe/stripe-js';

export interface InventoryColor {
  id: string;
  label: string;
  hex: string;
}

export interface InventorySize {
  id: string;
  label: string;
}

export interface InventorySku {
  id: string;
  inventoryProductId: string;
  color: InventoryColor;
  size: InventorySize;
  inventory: number;
  active: boolean;
}

export interface InventoryProduct {
  _id: string;
  inventoryProductId: string;
  name: string;
  description: string;
  tag: string;
  details: string[];
  sizes: InventorySize[];
  colors: InventoryColor[];
  skus: InventorySku[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductColor {
  id: string;
  label: string;
  hex: string;
  primaryImage: string;
  secondaryImages: string[];
}

export interface ProductSize {
  id: string;
  label: string;
  price: number;
}

export interface ProductSku {
  id: string;
  storeProductId: string;
  inventoryProductId: string;
  inventorySkuId: string;
  color: ProductColor;
  size: ProductSize;
  inventory: number;
  active: boolean;
}

type OrderSku = Omit<ProductSku, 'inventory' | 'active'>;

export type AddonItems = Record<string, PersonalizationAddon[]>;

export interface PersonalizationItem {
  id: string;
  name: string;
  location: string;
  type: 'list' | 'string' | 'number';
  list: string[];
  price: number;
  lines: number;
  limit: number;
  subItems: PersonalizationItem[];
}

export interface Personalization {
  active: boolean;
  maxLines: number;
  addons: PersonalizationItem[];
}

export interface StoreProduct {
  id: string;
  inventoryProductId: string;
  merchandiseCode: string;
  name: string;
  description?: string;
  tag: string;
  details?: string[];
  productSkus: ProductSku[];
  sizes: ProductSize[];
  colors: ProductColor[];
  personalization: Personalization;
}

export interface PersonalizationAddon {
  id: string;
  itemId: string;
  addon: string;
  value: string;
  name?: string;
  location: string;
  lines: number;
  limit?: number;
  type?: 'string' | 'number' | 'list';
  list?: string[];
  price: number;
  subItems: PersonalizationAddon[];
}

export interface CartItem {
  id: string;
  sku: ProductSku;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  itemTotal?: number;
  personalizationAddons: PersonalizationAddon[];
  personalizationTotal: number;
}

export interface OrderItem extends Omit<CartItem, 'sku'> {
  sku: OrderSku;
  merchandiseCode: string;
}

export type ShippingMethod = 'Primary' | 'Direct' | 'Store Pickup';

export interface Order {
  orderId: string;
  store: {
    id: string;
    name: string;
  };
  stripeId?: string;
  items: OrderItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  group: string;
  orderStatus: 'Unfulfilled';
  shippingMethod: ShippingMethod;
  shippingAddress: {
    name?: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  summary: {
    subtotal: number;
    shipping: number;
    salesTax: number;
    total: number;
    stripeFee: number;
  };
  refund: {
    status: 'None' | 'Partial' | 'Full';
    amount: number;
  };
  note?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  _id: string;
  storeId: string;
  name: string;
  openDate: string;
  permanentlyOpen: boolean;
  closeDate: string | null;
  hasPrimaryShippingLocation: boolean;
  primaryShippingLocation: PrimaryShippingAddress;
  allowDirectShipping: boolean;
  allowStorePickup: boolean;
  contact?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  requireGroupSelection: boolean;
  groupTerm: string;
  groups: string[];
  products: StoreProduct[];
  orders?: Order[];
  notes?: {
    id: string;
    text: string;
    createdAt: string;
  };
  showOnStoresPage: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreForStoresPage {
  _id: string;
  name: string;
  openDate: string;
  closeDate: string;
  permanentlyOpen: boolean;
  featuredImg: string;
  showOnStoresPage: boolean;
}

export interface CheckoutForm {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  groupRequired: boolean;
  group: string;
  shippingAddress: Address;
  shippingMethod: ShippingMethod;
  cardholderName: string;
  note?: string;
}

export interface ContactFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
  honeypot: string;
}

export interface Address {
  street: string;
  street2: string;
  city: string;
  state: string;
  zipcode: string;
}

export interface PrimaryShippingAddress extends Address {
  name: string;
}

export interface VerifyCartItemsAccumulator {
  items: OrderItem[];
  lowerInventoryItems: CartItem[];
  itemsOutOfStock: CartItem[];
  subtotal: number;
}

export interface UseCheckoutSubmit {
  cartIsEmpty: boolean;
  handleSubmit: (data: CheckoutForm) => Promise<void>;
  handleCardChange: (e: StripeCardElementChangeEvent) => void;
  isSubmitting: boolean;
  serverResponseError: string | undefined;
  stripe: Stripe | null;
  stripeError: string | undefined;
  verifiedItems: CartItem[];
  setVerifiedItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  lowerInventoryItems: CartItem[];
  setLowerInventoryItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  outOfStockItems: CartItem[];
  setOutOfStockItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  showInventoryModal: boolean;
  setShowInventoryModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface ShippingData {
  _id: string;
  price: number;
  freeMinimum: number;
}

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { id: string };
}
