import * as crypto from 'crypto';
import { FormikErrors, FormikTouched } from 'formik';
import {
  CartItem,
  ProductSku,
  ShippingMethod,
  SwitchFitnessDiscount,
} from '../interfaces';

type CalculateCartSubtotal = {
  cartItems: CartItem[];
  applySwitchFitnessDiscount?: boolean;
};

export function calculateCartSubtotal({
  cartItems,
  applySwitchFitnessDiscount = false,
}: CalculateCartSubtotal) {
  const rawCartSubtotal = cartItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);

  let cartSubtotal = rawCartSubtotal;
  if (applySwitchFitnessDiscount) {
    const cartSubtotalCheckingDiscount =
      rawCartSubtotal - 2500 > 0 ? rawCartSubtotal - 2500 : 0;
    cartSubtotal = cartSubtotalCheckingDiscount;
  }

  return {
    cartSubtotal,
    rawCartSubtotal,
  };
}

export function calculateSubtotalWithSwitchDiscount({
  switchFitnessDiscount,
  isEligibleForSwitchFitnessDiscount,
  initialSubtotal,
}: {
  switchFitnessDiscount: SwitchFitnessDiscount | null;
  isEligibleForSwitchFitnessDiscount: boolean;
  initialSubtotal: number;
}) {
  if (switchFitnessDiscount && isEligibleForSwitchFitnessDiscount) {
    return initialSubtotal - switchFitnessDiscount.discount > 0
      ? initialSubtotal - switchFitnessDiscount.discount
      : 0;
  }
  return initialSubtotal;
}

export function calculateSalesTax(subtotal: number) {
  return Math.round(subtotal * 0.055);
}

export function calculateShipping(
  price: number,
  freeMinimum: number,
  cartSubtotal: number,
  shippingMethod: ShippingMethod
) {
  if (
    shippingMethod === 'Primary' ||
    shippingMethod === 'Store Pickup' ||
    cartSubtotal >= freeMinimum
  ) {
    return 0;
  }

  return price;
}

export function calculateCartTotal(
  subtotal: number,
  salesTax = 0,
  shipping = 0
) {
  return subtotal + salesTax + shipping;
}

export function isOutOfStock(sku: ProductSku, cartItems: CartItem[]) {
  if (!sku.active || sku.inventory === 0) {
    return true;
  }

  const inventorySubtractingCartItems = cartItems.reduce(
    (inventory, currentCartItem) => {
      if (currentCartItem.sku.id === sku.id) {
        return inventory - currentCartItem.quantity;
      }
      return inventory;
    },
    sku.inventory
  );

  if (inventorySubtractingCartItems < 1) {
    return true;
  }
}

const ALPHA_NUM =
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export function createId(prefix?: string | false, len = 14) {
  const rnd = crypto.randomBytes(len);
  const value = new Array(len);
  const charsLength = ALPHA_NUM.length;

  for (let i = 0; i < len; i++) {
    value[i] = ALPHA_NUM[rnd[i] % charsLength];
  }

  const id = value.join('');

  if (prefix) return `${prefix}_${id}`;

  return id;
}

const NUM = '0123456789';

export function createReceiptNumber() {
  const rnd = crypto.randomBytes(11);
  const value = new Array(11);
  const charsLength = NUM.length;

  for (let i = 0; i < value.length; i++) {
    if (i === 5) {
      value[5] = '-';
    } else {
      value[i] = NUM[rnd[i] % charsLength];
    }
  }

  return value.join('');
}

// Deliberately not createReceiptNumber, which numbers real store orders and
// must keep its format. A contact reference is read off a screen and quoted
// back over the phone, so it is short and drops the characters that get
// misheard or mistyped: no 0/O, no 1/I, no 5/S, no 8/B.
const REFERENCE_CHARS = '234679ACDEFGHJKLMNPQRTUVWXYZ';

export function createContactReference() {
  const length = 6;
  const rnd = crypto.randomBytes(length);
  const value = new Array(length);

  for (let i = 0; i < length; i++) {
    value[i] = REFERENCE_CHARS[rnd[i] % REFERENCE_CHARS.length];
  }

  return value.join('');
}

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// "2026-09-15" is what a date input hands over, and it reads like a database
// row. US long form because Macaport and its customers are, so there is no
// 09/15 versus 15/09 to misread.
//
// Built from the parts rather than new Date(value): a date-only string parses
// as UTC midnight, which in Central time is the previous evening, so every
// deadline would quietly render a day early. Anything not in this exact shape
// is passed through untouched rather than guessed at.
export function formatDateValue(value?: string) {
  const raw = (value ?? '').trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!match) return raw;

  const [, year, month, day] = match;
  const name = MONTHS[Number(month) - 1];
  if (!name) return raw;

  return `${name} ${Number(day)}, ${year}`;
}

export function checkHexColor(hexValue: string) {
  // values considered too light
  const lightValues = ['c', 'd', 'e', 'f'];
  // remove #
  const alphaNumeric = hexValue.replace(/\W/g, '');
  // put 1st, 3rd, and 5th hex values into array
  const oddValues = alphaNumeric.split('').filter((v, i) => {
    if (i === 0 || i === 2 || i === 4) return true;
    return false;
  });
  // if 1st, 3rd, and 5th values are all in lightValues
  // the color is considered too light and cannot be used
  return oddValues.every(ov => lightValues.some(lv => lv === ov));
}

export function removeNonDigits(input: string) {
  return input.replace(/\D/g, '');
}

export function formatPhoneNumber(input: string) {
  const digits = removeNonDigits(input);
  const digitsArray = digits.split('');
  return digitsArray
    .map((v, i) => {
      if (i === 0) return `(${v}`;
      if (i === 2) return `${v}) `;
      if (i === 5) return `${v}-`;
      return v;
    })
    .join('');
}

export function formatToMoney(input: number, includeDecimal = false) {
  const price = input / 100;

  if (includeDecimal) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price}`;
  }
}

export function getTouchedErrors(
  errorValue: FormikErrors<string | FormikErrors<string>>,
  touchedValue: FormikTouched<boolean | FormikTouched<boolean>>
) {
  const testResult: string[] = [];

  if (typeof errorValue === 'string' && touchedValue === true) {
    testResult.push(errorValue);
  }

  if (typeof errorValue === 'object' && typeof touchedValue === 'object') {
    Object.keys(errorValue).forEach(key => {
      const result = getTouchedErrors(errorValue[key], touchedValue[key]);
      if (result) {
        testResult.push(...result);
      }
    });
  }

  return testResult;
}

export function getUrlParameter(query: string | string[] | undefined) {
  if (!query) return;
  return Array.isArray(query) ? query[0] : query;
}

export function slugify(input: string) {
  let result = input;
  // trim and convert to lowercase
  // and replace all spaces with a dash
  result = result.trim().toLowerCase().replace(/\s+/g, '-');
  // remove all non alpha-numeric characters (but keep dashes)
  result = result.replace(/[^0-9a-z-]/g, '');
  // remove all multiple dashes (--, ---, etc.)
  result = result.replace(/^-+|-+(?=-|$)/g, '');
  // remove dash if it's the first character
  result = result.replace(/^-/, '');
  // remove dash if it's the last character
  result = result.replace(/-$/, '');
  return result;
}

export const unitedStates = [
  'Alaska',
  'Alabama',
  'Arkansas',
  'Arizona',
  'California',
  'Colorado',
  'Connecticut',
  'District of Columbia',
  'Delaware',
  'Florida',
  'Georgia',
  'Hawaii',
  'Iowa',
  'Idaho',
  'Illinois',
  'Indiana',
  'Kansas',
  'Kentucky',
  'Louisiana',
  'Massachusetts',
  'Maryland',
  'Maine',
  'Michigan',
  'Minnesota',
  'Missouri',
  'Mississippi',
  'Montana',
  'North Carolina',
  'North Dakota',
  'Nebraska',
  'New Hampshire',
  'New Jersey',
  'New Mexico',
  'Nevada',
  'New York',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Pennsylvania',
  'Rhode Island',
  'South Carolina',
  'South Dakota',
  'Tennessee',
  'Texas',
  'Utah',
  'Virginia',
  'Vermont',
  'Washington',
  'Wisconsin',
  'West Virginia',
  'Wyoming',
];
