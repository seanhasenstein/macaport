import React from 'react';
import styled from 'styled-components';
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

export default function GangSheetCalculator() {
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
            <label className="sr-only" htmlFor="sheet-length">
              Sheet length in inches
            </label>
            <input
              id="sheet-length"
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

        {/* Radio inputs rather than six buttons, so arrow keys move between
            lengths and a screen reader announces "3 of 6" instead of six
            unrelated controls. A typed length simply leaves none checked.
            The legend is hidden: directly under the size row the chips need
            no heading of their own, and a third label made the block noisy. */}
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
                  name="sheet-preset"
                  value={preset}
                  checked={preset === length}
                  onChange={() => select(preset)}
                />
                <span>{preset}&quot;</span>
              </label>
            ))}
          </div>
        </fieldset>

        <p className="sizer-hint">You can resize it later in the builder.</p>
      </div>

      <div className="total">
        <div className="total-detail">
          <p>{formatCents(PRICE_PER_INCH_CENTS)} per inch</p>
          <p>
            {GANG_SHEET.widthInches}&quot; &times; {length}&quot; sheet
          </p>
        </div>
        <p className="total-value" aria-live="polite">
          {formatCents(sheetPriceCents(length))}
        </p>
      </div>

      <a className="cta" href={builderLink(length)}>
        Build a gang sheet
      </a>

      <a className="learn-more" href="#gang-sheets">
        Learn more about our DTF gang sheets
      </a>
    </CalculatorStyles>
  );
}

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
