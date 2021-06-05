type SecondaryImage = {
  id: number;
  url: string;
  alt: string;
};

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
  description: string;
  tag: string;
  price: number;
  sizes: string[];
  colors: Color[];
  skus: Sku[];
}

export interface Sku {
  id: string;
  productId: Item['id'];
  color: SkuColor;
  size: string;
}

export interface CartItem extends Item {
  id: string;
  productId: string;
  color: string;
  size: string;
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
