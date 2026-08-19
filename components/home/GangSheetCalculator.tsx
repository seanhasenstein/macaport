import React from 'react';
import styled, { css } from 'styled-components';
import { CheckIcon } from '@heroicons/react/20/solid';
import {
  GANG_SHEET,
  PRICE_PER_INCH_CENTS,
  builderLink,
  clampLength,
  formatCents,
  sheetPriceCents,
} from '../../config/gangSheets';
import {
  theme,
  badge,
  focusRing,
  focusRingNeutral,
  reducedMotion,
} from '../../styles/theme';

const DEFAULT_LENGTH = 24;

const BENEFITS = [
  'No account required to design and check out',
  'Ready in 1–3 business days',
  'Free local pickup or nationwide shipping',
];

type Props = {
  /** Namespaces this instance's ids and its radio group. Two calculators share
   *  one document: without distinct values their preset radios form a single
   *  group, so choosing a size in one silently clears the other, and the second
   *  card's label points at the first card's input. */
  instanceId: string;
  /** The link out to this section. Hidden on the instance that lives in it. */
  showLearnMore?: boolean;
  /** 'card' is the hero's tall panel. 'wide' is the closing block in the gang
   *  sheets section: three zones across the full width, without the card's
   *  selling copy, because the section it closes has already made that case.
   *  Two presentations of one tool rather than the same panel twice. */
  layout?: 'card' | 'wide';
};

export default function GangSheetCalculator({
  instanceId,
  showLearnMore = true,
  layout = 'card',
}: Props) {
  const lengthId = `${instanceId}-sheet-length`;
  const presetName = `${instanceId}-sheet-preset`;
  const [length, setLength] = React.useState(DEFAULT_LENGTH);
  // The input keeps its own string so the field can be cleared and retyped.
  // Clamping every keystroke would rewrite "1" to "12" before you reach "120".
  const [draft, setDraft] = React.useState(String(DEFAULT_LENGTH));

  const select = (next: number) => {
    setLength(next);
    setDraft(String(next));
  };

  const nudge = (by: number) => {
    select(clampLength(length + by) ?? length);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value.replace(/[^0-9]/g, '').slice(0, 3);
    setDraft(next);

    const parsed = Number(next);
    const inRange =
      next !== '' &&
      parsed >= GANG_SHEET.minLengthInches &&
      parsed <= GANG_SHEET.maxLengthInches;

    if (inRange) setLength(parsed);
  };

  const handleBlur = () => {
    select(clampLength(Number(draft)) ?? length);
  };

  // Shared by both layouts, so the control markup, its ids and its keyboard
  // behaviour are written once and only the composition around them differs.
  const sizeRow = (
    <div className="size-row">
      <span className="width">{GANG_SHEET.widthInches}&quot; wide</span>
      <span className="times" aria-hidden="true">
        &times;
      </span>
      <div className="stepper">
        <button
          type="button"
          onClick={() => nudge(-GANG_SHEET.stepInches)}
          disabled={length <= GANG_SHEET.minLengthInches}
          aria-label="Decrease length by one inch"
        >
          &minus;
        </button>
        <label className="sr-only" htmlFor={lengthId}>
          Sheet length in inches
        </label>
        <input
          id={lengthId}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete="off"
          value={draft}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <button
          type="button"
          onClick={() => nudge(GANG_SHEET.stepInches)}
          disabled={length >= GANG_SHEET.maxLengthInches}
          aria-label="Increase length by one inch"
        >
          +
        </button>
      </div>
      <span className="unit">inches long</span>
    </div>
  );

  // Radio inputs rather than six buttons, so arrow keys move between lengths
  // and a screen reader announces "3 of 6" instead of six unrelated controls.
  // A typed length simply leaves none checked.
  const presetChips = (
    <fieldset className="quick-select">
      <legend className="sr-only">Quick select a sheet length</legend>
      <div>
        {GANG_SHEET.presets.map(preset => (
          <label
            key={preset}
            className={preset === length ? 'preset selected' : 'preset'}
          >
            <input
              type="radio"
              name={presetName}
              value={preset}
              checked={preset === length}
              onChange={() => select(preset)}
            />
            <span>{preset}&quot;</span>
          </label>
        ))}
      </div>
    </fieldset>
  );

  const price = (
    <p className="total-value" aria-live="polite">
      {formatCents(sheetPriceCents(length))}
    </p>
  );

  if (layout === 'wide') {
    return (
      <WideStyles>
        <div className="zone">
          <p className="zone-label">
            Sheet length &middot; {GANG_SHEET.widthInches}&quot; wide
          </p>
          {presetChips}
          {/* The stepper had no label of its own and read as something left
              over under the chips. This says what it is for, and carries the
              full range, which was previously buried in a prose line. */}
          <p className="or">
            Or set any length from {GANG_SHEET.minLengthInches}&quot; to{' '}
            {GANG_SHEET.maxLengthInches}&quot;
          </p>
          {sizeRow}
        </div>

        <div className="zone">
          <p className="zone-label">Your price</p>
          {price}
          <p className="price-detail">
            {formatCents(PRICE_PER_INCH_CENTS)} per inch &middot;{' '}
            {GANG_SHEET.widthInches}&quot; &times; {length}&quot; sheet
          </p>
          <p className="price-detail quiet">
            Free store pickup, or shipping at checkout.
          </p>
        </div>

        <div className="zone action">
          {/* Not "Build a gang sheet" — that is the heading directly above
              this block, and the click does not build anything. It opens a
              different application, on a different domain, at the size chosen
              on the left. The heading says what you are doing; this says how
              you get there. */}
          <a className="cta" href={builderLink(length)}>
            Open the builder
          </a>
          {/* The two claims from the card's benefit list that are not already
              stated in the price zone beside this. Both answer a question
              someone asks at the moment of clicking rather than before it:
              whether they have to sign up, and when they get it. */}
          <ul className="assurances">
            <li>
              <CheckIcon aria-hidden="true" />
              No account needed to check out
            </li>
            <li>
              <CheckIcon aria-hidden="true" />
              Ready in 1&ndash;3 business days
            </li>
          </ul>
        </div>
      </WideStyles>
    );
  }

  return (
    <CalculatorStyles>
      <p className="eyebrow">DTF gang sheets</p>
      <h2>Design it, see your price, order it.</h2>
      <p className="intro">
        Built for shops, resellers, and anyone pressing their own apparel.
      </p>
      <ul className="benefits">
        {BENEFITS.map(item => (
          <li key={item}>
            <CheckIcon aria-hidden="true" />
            {item}
          </li>
        ))}
      </ul>

      <div className="sizer">
        <p className="sizer-label">Choose your sheet size</p>

        {sizeRow}

        {presetChips}

        <p className="sizer-hint">You can change the size in the builder.</p>
      </div>

      <div className="total">
        <div className="total-detail">
          <p>{formatCents(PRICE_PER_INCH_CENTS)} per inch</p>
          <p>
            {GANG_SHEET.widthInches}&quot; &times; {length}&quot; sheet
          </p>
        </div>
        {price}
      </div>

      <a className="cta" href={builderLink(length)}>
        Build a gang sheet
      </a>

      {showLearnMore && (
        <a className="learn-more" href="#gang-sheets">
          Learn more about our DTF gang sheets
        </a>
      )}
    </CalculatorStyles>
  );
}

// The controls themselves are identical in both layouts; only what sits
// around them changes. Kept as one block so a change to the stepper or the
// preset chips can never apply to just one of the two.
const sizeControls = css`
  .size-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: ${theme.color.textMuted};
  }

  .width {
    white-space: nowrap;
    color: ${theme.color.text};
    font-weight: 600;
  }

  .times {
    color: ${theme.color.textSubtle};
  }

  .stepper {
    display: flex;
    align-items: stretch;
    border: 1px solid ${theme.color.border};
    border-radius: ${theme.radius.md};
    overflow: hidden;

    button {
      padding: 0 0.6875rem;
      background-color: ${theme.color.surface};
      color: ${theme.color.textMuted};
      font-size: 1rem;
      line-height: 1;
      border: none;
      cursor: pointer;
      transition: background-color 150ms ease, color 150ms ease;
      ${reducedMotion}

      &:hover:not(:disabled) {
        background-color: ${theme.color.surfaceSunken};
        color: ${theme.color.text};
      }

      &:disabled {
        color: ${theme.color.border};
        cursor: not-allowed;
      }

      &:focus-visible {
        ${focusRingNeutral}
      }
    }

    input {
      padding: 0.5rem 0;
      width: 3rem;
      text-align: center;
      font-size: 0.9375rem;
      font-weight: 600;
      font-variant-numeric: tabular-nums;
      color: ${theme.color.text};
      background-color: ${theme.color.surface};
      border: none;
      border-left: 1px solid ${theme.color.border};
      border-right: 1px solid ${theme.color.border};
      border-radius: 0;
      box-shadow: none;

      /* Inset rather than a ring: the input sits between the two stepper
         buttons, so an outer ring would be clipped by the shared border. */
      &:focus {
        outline: 2px solid ${theme.color.neutral};
        outline-offset: -2px;
        border-color: ${theme.color.border};
      }
    }
  }

  .unit {
    white-space: nowrap;
  }

  .quick-select {
    margin: 0.75rem 0 0;
    padding: 0;
    border: none;

    div {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }
  }

  .preset {
    position: relative;
    padding: 0.4375rem 0.6875rem;
    display: inline-flex;
    background-color: ${theme.color.surface};
    color: ${theme.color.textMuted};
    font-size: 0.8125rem;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    border: 1px solid ${theme.color.border};
    border-radius: ${theme.radius.md};
    cursor: pointer;
    transition: border-color 150ms ease, background-color 150ms ease,
      color 150ms ease;
    ${reducedMotion}

    /* The real radio stays in the layer but invisible, so the label keeps
       native keyboard and screen reader behaviour. */
    input {
      position: absolute;
      inset: 0;
      margin: 0;
      padding: 0;
      opacity: 0;
      border: none;
      box-shadow: none;
      cursor: pointer;
      appearance: none;
    }

    &:hover {
      border-color: ${theme.color.borderStrong};
      color: ${theme.color.text};
    }

    /* Solid dark, not a green tint. Green means "action" on this page, and a
       selected chip is a *value*, not a button. Dark also survives a glance
       across six near-identical chips, which a pale tint of any hue does not. */
    &.selected {
      background-color: ${theme.color.neutral};
      border-color: ${theme.color.neutral};
      color: ${theme.color.onNeutral};
    }

    &:focus-within {
      ${focusRingNeutral}
    }
  }
`;

const CalculatorStyles = styled.div`
  padding: 1.75rem;
  width: 100%;
  max-width: 28rem;
  background-color: ${theme.color.surface};
  border: 1px solid ${theme.color.border};
  border-radius: ${theme.radius.lg};
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.04), 0 12px 32px -12px rgb(0 0 0 / 0.16);

  .eyebrow {
    ${badge}
    margin: 0 0 0.875rem;
  }

  h2 {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 700;
    color: ${theme.color.text};
    letter-spacing: -0.022em;
  }

  .intro {
    margin: 0.375rem 0 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: ${theme.color.textMuted};
    /* pretty, not balance: keeps the natural line lengths and only pulls the
       last line up to more than one word. balance evened the two lines, which
       made the first line oddly short. */
    text-wrap: pretty;
  }

  .benefits {
    margin: 0.875rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    list-style-type: none;

    li {
      display: flex;
      align-items: center;
      gap: 0.4375rem;
      font-size: 0.8125rem;
      line-height: 1.4;
      color: ${theme.color.text};
    }

    svg {
      flex-shrink: 0;
      height: 0.9375rem;
      width: 0.9375rem;
      color: ${theme.color.brand};
    }
  }

  /* One label, one control, one row of shortcuts, one note — in that order.
     Everything in this block is about picking a single number. */
  .sizer {
    margin: 1.375rem 0 0;
    padding: 1.25rem 0 0;
    border-top: 1px solid ${theme.color.border};
  }

  .sizer-label {
    margin: 0 0 0.75rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${theme.color.text};
  }

  ${sizeControls}

  .sizer-hint {
    margin: 0.75rem 0 0;
    font-size: 0.75rem;
    color: ${theme.color.textSubtle};
  }

  .total {
    margin: 1.25rem 0 0;
    padding: 1.25rem 0 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    border-top: 1px solid ${theme.color.border};
  }

  .total-detail p {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.45;
    color: ${theme.color.textMuted};
    font-variant-numeric: tabular-nums;
  }

  .total-value {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    color: ${theme.color.text};
    letter-spacing: -0.025em;
    font-variant-numeric: tabular-nums;
  }

  .cta {
    margin: 1.25rem 0 0;
    padding: 0.8125rem 1.5rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: ${theme.color.brand};
    color: ${theme.color.onBrand};
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: ${theme.radius.md};
    transition: background-color 150ms ease;
    ${reducedMotion}

    &:hover {
      background-color: ${theme.color.brandHover};
    }

    &:focus-visible {
      ${focusRing}
    }
  }

  .learn-more {
    margin: 1rem 0 0;
    display: flex;
    justify-content: center;
    font-size: 0.8125rem;
    font-weight: 500;
    color: ${theme.color.textMuted};
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 150ms ease;
    ${reducedMotion}

    &:hover {
      color: ${theme.color.text};
    }

    &:focus-visible {
      ${focusRing}
      border-radius: ${theme.radius.sm};
    }
  }

  @media (max-width: 600px) {
    .size-row {
      flex-wrap: wrap;
      gap: 0.5rem 0.375rem;
    }

    .quick-select div {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
    }

    .preset {
      justify-content: center;
    }
  }

  @media (max-width: 480px) {
    padding: 1.25rem;
  }
`;

// The closing block of the gang sheets section. Three zones divided by the
// same hairlines the value props band uses, so the width is filled with
// structure rather than one long row of loose parts. On a phone it stacks into
// three labelled blocks rather than collapsing back into the hero card's
// silhouette, which is what made two instances read as a duplicate.
const WideStyles = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(0, 1fr) auto;
  align-items: stretch;
  background-color: ${theme.color.surface};
  border: 1px solid ${theme.color.borderStrong};
  border-radius: ${theme.radius.lg};
  overflow: hidden;

  ${sizeControls}

  .zone {
    padding: 1.5rem 1.625rem;
  }

  .zone + .zone {
    border-left: 1px solid ${theme.color.border};
  }

  /* Brand green, the only colour in the block. Every section on this page
     names itself with small uppercase green type, so these join a language the
     reader already has. The controls stay neutral on purpose — those tones are
     sampled from the builder's own buttons and chips, which is what makes this
     read as a preview of the app the button opens. */
  .zone-label {
    margin: 0 0 0.75rem;
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${theme.color.brand};
  }

  .or {
    margin: 0.875rem 0 0.5rem;
    font-size: 0.8125rem;
    color: ${theme.color.textMuted};
  }

  .size-row {
    margin: 0;
  }

  .total-value {
    margin: 0;
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.028em;
    color: ${theme.color.text};
    font-variant-numeric: tabular-nums;
  }

  .price-detail {
    margin: 0.4375rem 0 0;
    font-size: 0.8125rem;
    line-height: 1.55;
    color: ${theme.color.textMuted};
    font-variant-numeric: tabular-nums;

    &.quiet {
      margin-top: 0.5rem;
      color: ${theme.color.textSubtle};
    }
  }

  /* Centred in its own zone so the button sits level with the price beside it
     however tall the two columns to its left end up. */
  .action {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    background-color: ${theme.color.surfaceMuted};
    border-left: 1px solid ${theme.color.border};
  }

  .cta {
    padding: 0.8125rem 1.75rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${theme.color.onNeutral};
    background-color: ${theme.color.neutral};
    border-radius: ${theme.radius.md};
    transition: background-color 150ms ease;
    ${reducedMotion}

    &:hover {
      background-color: ${theme.color.neutralHover};
    }

    &:focus-visible {
      ${focusRingNeutral}
    }
  }
  .assurances {
    margin: 0.875rem 0 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    list-style-type: none;

    li {
      display: flex;
      align-items: center;
      gap: 0.375rem;
      font-size: 0.75rem;
      line-height: 1.35;
      color: ${theme.color.textMuted};
    }

    svg {
      flex-shrink: 0;
      height: 0.875rem;
      width: 0.875rem;
      color: ${theme.color.brand};
    }
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;

    .zone + .zone {
      border-left: none;
      border-top: 1px solid ${theme.color.border};
    }

    .action {
      border-left: none;
      border-top: 1px solid ${theme.color.border};
    }
  }
`;
