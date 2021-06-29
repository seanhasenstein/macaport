import * as crypto from 'crypto';
import { CartItem } from '../interfaces';

const months = [
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

// Demo store code...

export function calculateCartSubtotal(items: CartItem[]) {
  return items.reduce(
    (total, item) => total + item.quantity! * item.size.price,
    0
  );
}

export function calculateTransactionFee(subtotal: number) {
  if (subtotal === 0) {
    return 0;
  }
  return Math.ceil((subtotal + 30) / (1 - 0.029)) - subtotal;
}

export function calculateCartTotal(subtotal: number, transactionFee = 0) {
  return subtotal + transactionFee;
}

export function formatToMoney(input: number, includeDecimal = false) {
  const price = input / 100;

  if (includeDecimal) {
    return `$${price.toFixed(2)}`;
  } else {
    return `$${price}`;
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

export function formatDate(input: string) {
  const dateObj = new Date(input);
  const month = months[dateObj.getMonth()];
  const date = dateObj.getDate();
  const year = dateObj.getFullYear();
  return `${month} ${date}, ${year}`;
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
