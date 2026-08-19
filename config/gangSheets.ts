// Snapshot of Macaport's Heddley tenant config (width, min/max length, price
// per inch) plus the platform-wide 1" increment. Macaport can change these from
// their Heddley dashboard, and nothing here finds out — they must be updated by
// hand when that happens.
//
// TODO: read the live rate from the gang sheet app at build time with ISR
// instead. Blocked today: that endpoint resolves its tenant from the request
// host and has no cross-origin entry point.

// Cents, not dollars — every displayed rate and total derives from this one
// number, so a price change is a one-line edit and integer math keeps the
// arithmetic exact.
export const PRICE_PER_INCH_CENTS = 50;

export const MIN_LENGTH_INCHES = 12;

// Matches the builder's own maximum. Anything longer is sold as multiple
// sheets, so this is the largest length the card should ever quote.
export const MAX_LENGTH_INCHES = 120;

export const GANG_SHEET = {
  widthInches: 22,
  pricePerInchCents: PRICE_PER_INCH_CENTS,
  minLengthInches: MIN_LENGTH_INCHES,
  maxLengthInches: MAX_LENGTH_INCHES,
  stepInches: 1,
  // Mirrors the builder's own quick-select row so the two size pickers match.
  presets: [12, 24, 36, 48, 60, 72],
  builderUrl: 'https://sheets.macaport.com/editor',
} as const;

export const sheetPriceCents = (lengthInches: number) =>
  lengthInches * PRICE_PER_INCH_CENTS;

export const builderLink = (lengthInches: number) =>
  `${GANG_SHEET.builderUrl}?length=${lengthInches}`;

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export const formatCents = (cents: number) => currency.format(cents / 100);

// Clamps to the sellable range and drops fractional inches, since the builder
// accepts whole-inch lengths. Returns null for input that isn't a number at
// all, so callers can leave a half-typed field alone instead of fighting it.
export const clampLength = (value: number) => {
  if (!Number.isFinite(value)) return null;
  return Math.min(
    MAX_LENGTH_INCHES,
    Math.max(MIN_LENGTH_INCHES, Math.round(value))
  );
};
