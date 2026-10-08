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

export interface SizeChartCategory {
  name: string; // 'Chest', 'Hip', 'Length', etc.
  unit: string; // e.g. 'in', 'cm', etc.
  sizes: {
    label: string;
    value: string;
  }[];
}

export type SizeChart = SizeChartCategory[];

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
  sizeChart?: SizeChart;
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
  sizeChart?: SizeChart;
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
  status: {
    current: 'Unfulfilled';
    meta: { Unfulfilled: { user: 'system'; updatedAt: string } };
  };
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
    discount?: number;
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
  sheboyganLutheranStaffDiscount?: {
    id: string;
    email: string;
    discount: number;
  };
  teacherAppreciation?: {
    id: string;
    email: string;
  };
  switchFitnessDiscount?: {
    id: string;
    email: string;
  };
  meta: {
    receiptPrinted: boolean;
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
  // Plain text shown to customers on the store's homepage, its product pages,
  // and the closed page once it closes. Unlike notes, which are internal and
  // never sent to the storefront.
  announcement?: string | null;
  createdAt: string;
  updatedAt: string;
  teacherAppreciationId: string;
  sheboyganLutheranStaffId?: string;
  meta: {
    isSwitchFitness?: boolean;
    switchFitnessDiscountId?: string;
  };
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

export type InquiryType =
  | 'apparel'
  | 'team-store'
  | 'gang-sheets'
  | 'onsite'
  | 'existing'
  | 'missed-deadline'
  | 'other';

export interface ContactFormValues {
  inquiryType: InquiryType | '';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  // A company's own web address. Optional on purpose, and its value is in
  // whether someone bothers rather than in the answer itself: a real business
  // types it without thinking, and a fabricated one leaves it blank or gives a
  // domain that does not resolve.
  website: string;
  // No budget field, which was considered and dropped rather than overlooked.
  // It told us nothing a fabricated enquiry could not type for free — unlike a
  // website, which has to resolve, or an address, which can be checked — and
  // asking a customer what they will spend when they came to find out what it
  // costs is the kind of question that loses the ones who are still deciding.
  // Shared by both paths: what you want printed, or what you want the store
  // to sell. Same option list either way, so it's one field with two labels.
  products: string[];
  // Keyed by product id, so only the items actually selected carry a number.
  quantities: Record<string, string>;
  // Free text, only asked for when "Something else" is one of the products.
  productOther: string;
  // Store name reuses `organization`; this is the order number alone.
  orderNumber: string;
  // How the garments get decorated. Deliberately separate from `products` —
  // embroidery is a process, not a thing you can order a quantity of.
  decoration: string;
  // Multi-select: one order can mix fabrics, and a store can offer more than
  // one way of getting the order to people.
  fabric: string[];
  colors: string;
  artwork: string;
  delivery: string;
  // Where it goes, asked only once `delivery` says it is being shipped. One
  // textarea rather than five address fields: this is a quote request and not
  // a checkout, so the address is here to be read rather than parsed.
  shipToAddress: string;
  shipping: string[];
  neededBy: string;
  groupSize: string;
  // Onsite printing. Dates and hours are free text on purpose: "March 14-16",
  // "every Saturday in June" and "8am until the final" are all real answers,
  // and a date picker can express none of them.
  personalization: string[];
  personalizationOther: string;
  schedule: string;
  sizeMix: string[];
  eventName: string;
  // What kind of day it is, and who is there. Both decide what comes off the
  // van: a weekend fair needs different stock from a one-day meet, and boys
  // and girls divisions need different cuts. Replaced whoPays, which asked
  // about money the terms cannot yet answer.
  eventType: string;
  audience: string[];
  eventDates: string;
  eventHours: string;
  venue: string;
  venueSetting: string;
  power: string;
  openTiming: string;
  storeDuration: string;
  message: string;
  honeypot: string;
}

// What the request itself carried, as opposed to what the customer typed.
// Deliberately not folded into `submission` for that reason: nobody answered
// any of it, and mixing the two would let a value nobody supplied be read back
// later as though they had.
//
// This exists to tell a real enquiry from a fabricated one. Every field is read
// from a header rather than the body — the single exception is documented on
// `durationMs` — so the form cannot decide what lands here.
export interface ContactRequestMeta {
  // Best available client address, from clientIp in utils/rateLimit.
  //
  // Stored raw rather than hashed or encrypted, which is a deliberate choice
  // and worth stating: the entire use of an address is looking at it — placing
  // it, and matching it against other enquiries — and none of that survives
  // being made unreadable. A hash would still match duplicates but could no
  // longer be placed, and application-level encryption would put the key
  // beside the data and buy nothing. Atlas already encrypts at rest.
  //
  // The privacy control here is retention, not encryption. See the note above
  // createContactMessage in db/contactMessage.ts.
  ip: string;
  userAgent: string;
  // Where they arrived from, and what their browser asks to be served. An
  // enquiry with no referrer at all reached /contact directly rather than from
  // a search or a link, and a US business whose browser prefers a non-US
  // locale is worth reading twice.
  referer: string;
  acceptLanguage: string;
  // Milliseconds between the form rendering and the submission landing, as
  // measured by the browser.
  //
  // Client-supplied, and so forgeable by anything that bothers to forge it —
  // which is the honest limit of this field. It is kept anyway because a form
  // with this many questions completed in under a couple of seconds was not
  // completed by a person, and the scripts that submit that fast are generally
  // not the ones paying attention to headers.
  //
  // Null when the browser sent nothing usable, which includes every request
  // from a bundle older than this field.
  durationMs: number | null;
}

// A contact enquiry as it is kept, rather than as it is emailed. The emails
// remain the way anyone actually reads these; this exists so that a lead is not
// held solely inside a mail transaction that has already completed.
export interface ContactMessage {
  _id: string;
  // The same reference the customer is given in their confirmation, so the
  // number we print in an email finally resolves to something.
  referenceId: string;
  // A real Date, not the long "August 15, 2026 at 9:00am (CT)" string the
  // emails carry. That one is formatted for reading in a sentence and is
  // useless for sorting or for a range query.
  submittedAt: Date;
  inquiryType: string;
  // Everything they filled in, minus the honeypot, which is only ever empty by
  // the time a submission reaches here and is noise in a stored record.
  submission: Omit<ContactFormValues, 'honeypot'>;
  // Whether each email was handed to Mailgun without being rejected. Not proof
  // it arrived — nothing here can know that — but a false is a lead that
  // definitely did not reach anyone, which is the case worth finding.
  delivery: {
    notification: boolean;
    confirmation: boolean;
  };
  // Absent on every enquiry stored before this existed, so anything reading it
  // has to cope with it missing rather than assume a gap means a clean record.
  meta?: ContactRequestMeta;
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
  alreadyIncludedFreeItem: boolean;
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

// Teacher Appreciation ********************************
export interface TeacherAppreciation {
  _id: string;
  active: boolean;
  year: number;
  storeId: string;
  eligibleEmails: string[];
  usedEmails: string[];
}

// Sheboygan Lutheran Staff **************************
export interface SheboyganLutheranStaff {
  _id: string;
  active: boolean;
  year: number;
  storeId: string;
  eligibleAccounts: { firstName: string; lastName: string; email: string }[];
  usedEmails: string[];
  discount: number;
}

// Switch Fitness Discount ********************************
export interface SwitchFitnessDiscount {
  _id: string;
  active: boolean;
  storeId: string;
  discount: number;
  eligibleEmails: string[];
  usedEmails: string[];
}
