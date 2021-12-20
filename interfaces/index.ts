import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';

export interface Size {
  id: number;
  label: string;
  price: number;
}

export interface Color {
  id: string;
  label: string;
  hex: string;
  primaryImage: string;
  secondaryImages: string[];
}

export interface Sku {
  id: string;
  productId: string;
  color: Color;
  size: Size;
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  details?: string[];
  tag: string;
  sizes: Size[];
  colors: Color[];
  skus: Sku[];
}

export interface CartItem {
  id: string;
  sku: Sku;
  name: string;
  image?: string;
  price: number;
  quantity?: number;
  itemTotal?: number;
  customName: string;
  customNumber: string;
}

export interface Order {
  _id?: string;
  orderId: string;
  store: {
    id: string;
    name: string;
  };
  stripeId?: string;
  items: CartItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  orderStatus: 'Unfulfilled';
  shippingMethod: 'Primary' | 'Direct' | 'None';
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
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface Store {
  _id: string;
  storeId: string;
  name: string;
  openDate: string;
  hasCloseDate: boolean;
  closeDate: string | null;
  category: 'macaport' | 'client';
  hasPrimaryShippingLocation: boolean;
  primaryShippingLocation: {
    name: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  allowDirectShipping: boolean;
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  products: Product[];
  orders: Order[];
  createdAt: string;
  updatedAt: string;
}

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { id: string };
}
