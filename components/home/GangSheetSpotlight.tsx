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

// Colours for the pricing callout, the only dark surface on the homepage.
// They are local because the theme's ramps are built for light grounds and
// both run the wrong way here.
//
// Brand green does not survive the callout: #0d6b2b on #171717 is 2.69:1,
// under the 3:1 WCAG asks for a control's edge, so the button blurred into the
// panel it sat in. The usable band above it is narrow — brighten much further
// and the white label starts failing its own 4.5:1 (#118a3b is already 4.45)
// — so these two are close to the only pair clearing both in both states.
const BRAND_ON_DARK = '#0f7d33'; // 3.42:1 on the callout, 5.25:1 under white
const BRAND_ON_DARK_HOVER = '#108438'; // 3.74:1 and 4.79:1

// Detail text. textMuted is 3.78:1 against near-black and fails AA at the 15px
// this is set in — the tokens named "muted" and "subtle" are chosen to recede
// from white, and on dark they recede until they stop being readable.
const TEXT_ON_DARK = '#d4d4d4';

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
//
// No bottom border, unlike every other section. This is the last one on the
// page and the footer already draws its own top rule — carrying one here too
// stacked two hairlines with nothing between them and read as a 2px line. The
// footer's stays because on every other page it is the only rule there is.
const SpotlightStyles = styled.section`
  padding: 0 1.5rem;
  background-color: ${theme.color.surfaceSunken};
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
    /* Twelve of these run down the page across the four sections, so their
       weight adds up fast. See borderRule in styles/theme.ts for why it is its
       own token rather than one of the text or border tones.

       The 2px is what keeps them structural at that tone — halved to 1px they
       would join the hairlines between sections and stop grouping anything. */
    border-top: 2px solid ${theme.color.borderRule};
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
    color: ${TEXT_ON_DARK};
    font-variant-numeric: tabular-nums;

    /* textSubtle, which is lighter than textMuted and therefore the more
       legible of the two here — the ramp inverts on a dark ground. */
    &.muted {
      margin-top: 0.375rem;
      color: ${theme.color.textSubtle};
    }
  }

  .cta {
    padding: 0.875rem 1.75rem;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    background-color: ${BRAND_ON_DARK};
    color: ${theme.color.onBrand};
    font-size: 0.9375rem;
    font-weight: 600;
    border-radius: ${theme.radius.md};
    transition: background-color 150ms ease;
    ${reducedMotion}

    /* Brightens where every other button on the site darkens. That is not an
       inconsistency but the same rule applied to an inverted ground: on white,
       more prominent means darker; on near-black it means lighter. */
    &:hover {
      background-color: ${BRAND_ON_DARK_HOVER};
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
