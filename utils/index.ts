import * as crypto from 'crypto';
import { FormikErrors, FormikTouched } from 'formik';
import { CartItem, ProductSku } from '../interfaces';

export function calculateCartSubtotal(cartItems: CartItem[]) {
  return cartItems.reduce((total, item) => {
    return total + item.quantity * item.price;
  }, 0);
}

export function calculateSalesTax(subtotal: number) {
  return Math.round(subtotal * 0.055);
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

export function isStoreActive(openDate: string, closeDate: string | null) {
  const open = new Date(openDate);
  const close = new Date(closeDate || 'Jan 01 9999');
  const now = new Date();

  if (now < open || now > close) {
    return false;
  }

  if (now > open && now < close) {
    return true;
  }
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
