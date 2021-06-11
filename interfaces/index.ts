export type SecondaryImage = {
  id: number;
  url: string;
  alt: string;
};

export interface Size {
  id: number;
  label: string;
  price: number;
}

export interface Color {
  id: number;
  label: string;
  hex: string;
  primaryImage: string;
  secondaryImages?: SecondaryImage[];
}

type SkuColor = Omit<Color, 'hex' | 'primaryImage' | 'secondaryImages'>;

export interface Item {
  id: string;
  name: string;
  description?: string;
  details?: string[];
  tag: string;
  sizes: Size[];
  colors: Color[];
  skus: Sku[];
}

export interface Sku {
  id: string;
  productId: Item['id'];
  color: SkuColor;
  size: Size;
}

export interface CartItem extends Item {
  productId: string;
  color: string;
  size: Size;
  image?: string;
  quantity?: number;
  itemTotal?: number;
}

export interface Order {
  _id?: string;
  orderId: string;
  stripeId?: string;
  items: CartItem[];
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    cardholderName: string;
  };
  summary: {
    subtotal: number;
    transactionFee: number;
    total: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Store {
  id: string;
  name: string;
  slug: string;
  startDate: string;
  closeDate: string | null;
  contact: {
    name: string;
    email: string;
    phone: string;
  };
  primaryShippingAddress: string;
  products: Item[];
  createdAt: string;
  updatedAt: string;
}
