interface Color {
  id: number;
  label: string;
  hex: string;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  tag: string;
  image: string;
  price: number;
  sizes: string[];
  colors: Color[];
  skus: Sku[];
}

export interface Sku {
  id: string;
  productId: Item['id'];
  color: Color;
  size: string;
}

export interface CartItem extends Item {
  id: string;
  productId: string;
  color: string;
  size: string;
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
