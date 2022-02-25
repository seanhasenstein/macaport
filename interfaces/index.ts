import { NextApiRequest } from 'next';
import { Db, MongoClient } from 'mongodb';

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
  includeCustomName: boolean;
  includeCustomNumber: boolean;
}

export interface CartItem {
  id: string;
  sku: ProductSku;
  name: string;
  image?: string;
  price: number;
  quantity: number;
  itemTotal?: number;
  customName: string;
  customNumber: string;
}

export interface OrderItem extends Omit<CartItem, 'sku'> {
  sku: OrderSku;
  merchandiseCode: string;
}

export interface Order {
  _id?: string;
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
    stripeFee: number;
  };
  refund: {
    status: 'None' | 'Partial' | 'Full';
    amount: number;
  };
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
  primaryShippingLocation: {
    name: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  allowDirectShipping: boolean;
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
  createdAt: string;
  updatedAt: string;
}

export interface Request extends NextApiRequest {
  db: Db;
  dbClient: MongoClient;
  query: { id: string };
}
