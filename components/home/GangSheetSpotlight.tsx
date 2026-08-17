import styled from 'styled-components';
import BrowserFrame from '../ui/BrowserFrame';
import {
  GANG_SHEET,
  PRICE_PER_INCH_CENTS,
  builderLink,
  formatCents,
  sheetPriceCents,
} from '../../config/gangSheets';
import { theme, reducedMotion } from '../../styles/theme';

const steps = [
  {
    id: '01',
    title: 'Add your artwork',
    body: 'Upload your images, or pull files from a previous order out of your image library. Add text in a range of fonts and colors.',
  },
  {
    id: '02',
    title: 'Arrange it, or let the builder do it',
    body: 'Drag pieces where you want them, or hit auto layout. Align, distribute, duplicate, and nudge anything into place. The sheet grows as you add art and warns you if pieces overlap or run outside the print area.',
  },
  {
    id: '03',
    title: 'Trim, check, and check out',
    body: 'One click removes unused length and tells you what it saved. Anything under 150 DPI gets flagged before you pay, not after. Save a draft, set your quantity, and check out.',
  },
];

export default function GangSheetSpotlight() {
  return (
    <SpotlightStyles id="gang-sheets">
      <div className="wrapper">
        <div className="intro">
          <p className="eyebrow">DTF gang sheets</p>
          <h2>From artwork to checkout in one sitting.</h2>
          <p className="lede">
            No emailing files back and forth and waiting on a quote. Lay the
            sheet out yourself in the browser, see exactly what it costs as you
            go, and check out when it looks right. Make an account and your
            artwork, drafts, and past orders are waiting next time, which makes
            reordering fast.
          </p>
        </div>

        <div className="screenshot">
          <BrowserFrame
            src="/images/gang-sheet-editor.png"
            alt="The Macaport gang sheet builder with several logos arranged on a 22 inch sheet, a layers panel, and a low resolution warning"
            width={2000}
            height={999}
            label="sheets.macaport.com/editor"
          />
        </div>

        <ol className="steps">
          {steps.map(step => (
            <li key={step.id}>
              <span className="step-number" aria-hidden="true">
                {step.id}
              </span>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="callout">
          <div className="pricing">
            <p className="price">
              {formatCents(PRICE_PER_INCH_CENTS)}
              <span> per inch of length</span>
            </p>
            <p className="price-detail">
              {GANG_SHEET.widthInches}&quot; wide, {GANG_SHEET.minLengthInches}
              &quot; to {GANG_SHEET.maxLengthInches}&quot; long. A{' '}
              {GANG_SHEET.widthInches}&quot; &times; {GANG_SHEET.presets[1]}
              &quot; sheet is {formatCents(sheetPriceCents(GANG_SHEET.presets[1]))}.
              Order as many sheets as you need.
            </p>
            <p className="price-detail muted">
              Free store pickup, or shipping at checkout.
            </p>
          </div>
          <a className="cta" href={builderLink(GANG_SHEET.presets[1])}>
            Build a gang sheet
          </a>
        </div>
      </div>
    </SpotlightStyles>
  );
}

// The only sunken band on the page, and the only section a customer can
// finish without anyone at Macaport: apparel, team stores, and onsite all end
// in "talk to us", this one ends at a checkout. The tone change marks that
// shift rather than just breaking up the scroll, which is why it is one
// deliberate exception instead of an alternating stripe.
const SpotlightStyles = styled.section`
  padding: 0 1.5rem;
  background-color: ${theme.color.surfaceSunken};
  border-bottom: 1px solid ${theme.color.border};
  scroll-margin-top: 1.5rem;

  .wrapper {
    margin: 0 auto;
    padding: 5rem 0;
    width: 100%;
    max-width: ${theme.maxWidth};
  }

  .intro {
    max-width: 42rem;
  }

  .eyebrow {
    margin: 0 0 0.875rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${theme.color.brand};
  }

  h2 {
    margin: 0;
    font-size: 2.25rem;
    line-height: 1.15;
    font-weight: 700;
    color: ${theme.color.text};
    letter-spacing: -0.028em;
    text-wrap: balance;
  }

  .lede {
    margin: 1.125rem 0 0;
    font-size: 1.0625rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
  }

  .screenshot {
    margin: 3rem 0 0;
  }

  .steps {
    margin: 3rem 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.5rem;
    list-style-type: none;
  }

  .steps li {
    padding: 1.125rem 0 0;
    border-top: 2px solid ${theme.color.text};
  }

  .step-number {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: ${theme.color.brand};
    font-variant-numeric: tabular-nums;
  }

  .steps h3 {
    margin: 0.625rem 0 0;
    font-size: 1.0625rem;
    font-weight: 600;
    color: ${theme.color.text};
    letter-spacing: -0.012em;
  }

  .steps p {
    margin: 0.5rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
  }

  .callout {
    margin: 3.5rem 0 0;
    padding: 2.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 2.5rem;
    background-color: ${theme.color.text};
    border-radius: ${theme.radius.lg};
  }

  .pricing {
    max-width: 34rem;
  }

  .price {
    margin: 0;
    font-size: 2.25rem;
    font-weight: 700;
    color: ${theme.color.surface};
    letter-spacing: -0.028em;
    font-variant-numeric: tabular-nums;

    span {
      margin: 0 0 0 0.5rem;
      font-size: 1rem;
      font-weight: 500;
      color: ${theme.color.textSubtle};
      letter-spacing: 0;
    }
  }

  .price-detail {
    margin: 0.75rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #d4d4d4;
    font-variant-numeric: tabular-nums;

    &.muted {
      margin-top: 0.375rem;
      color: ${theme.color.textMuted};
    }
  }

  .cta {
    padding: 0.875rem 1.75rem;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    background-color: ${theme.color.brand};
    color: ${theme.color.onBrand};
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: ${theme.radius.md};
    transition: background-color 150ms ease;
    ${reducedMotion}

    &:hover {
      background-color: #0f7d33;
    }

    &:focus-visible {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: 0 0 0 2px ${theme.color.text},
        0 0 0 4px ${theme.color.surface};
    }
  }

  @media (max-width: 900px) {
    .wrapper {
      padding: 3.5rem 0;
    }

    h2 {
      font-size: 1.75rem;
    }

    .steps {
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }

    .callout {
      padding: 1.75rem;
      flex-direction: column;
      align-items: flex-start;
      gap: 1.5rem;
    }

    .price {
      font-size: 1.875rem;

      span {
        display: block;
        margin: 0.25rem 0 0;
      }
    }

    .cta {
      width: 100%;
      justify-content: center;
    }
  }
`;
