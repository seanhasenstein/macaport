import { CartItem } from '../interfaces';

// One order's worth of lines, generously. A body longer than this is not a
// checkout.
const MAX_ITEMS = 200;

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim() !== '';

/**
 * A quantity has to be a positive whole number.
 *
 * The write this guards is `inventory - quantity`, so a negative quantity adds
 * stock rather than removing it. That is the more expensive direction to get
 * wrong: stock nobody has gets sold, and it surfaces later as orders that
 * cannot be filled rather than as an error anyone sees at the time.
 */
const isCount = (value: unknown): value is number =>
  typeof value === 'number' &&
  Number.isInteger(value) &&
  value > 0 &&
  value <= 10_000;

/**
 * Whether a request body is a checkout worth writing stock for.
 *
 * Lives here rather than in the route so the tests exercise the same function
 * the endpoint runs. A copy in the test file would be free to drift from the
 * one guarding the database, which defeats the point of testing it.
 */
export function looksLikeCheckoutItems(body: unknown): body is CartItem[] {
  if (!Array.isArray(body) || body.length === 0) return false;
  if (body.length > MAX_ITEMS) return false;

  return body.every(
    item =>
      !!item &&
      typeof item === 'object' &&
      isCount(item.quantity) &&
      isNonEmptyString(item.sku?.inventoryProductId) &&
      isNonEmptyString(item.sku?.inventorySkuId)
  );
}
