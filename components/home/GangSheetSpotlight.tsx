import styled from 'styled-components';
import BrowserFrame from '../ui/BrowserFrame';
import GangSheetCalculator from './GangSheetCalculator';
import { theme } from '../../styles/theme';

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

        {/* The same card as the hero, not a static restatement of it. The
            price here now responds to the size someone picks, and its button
            carries that length into the builder — the old callout always sent
            24 inches whatever it said above the button. */}
        <div className="closer">
          {/* Opens a sequence rather than labelling a fact. Nothing in a static
              read of the block's own labels says the chips are clickable, and
              "what a sheet costs" framed it as a reference table when it is
              actually the way into the builder. The second line says what
              happens after the button, which connects it to step 01. */}
          <h3 className="closer-heading">Build a gang sheet</h3>
          <p className="closer-lede">
            Sheets are priced by the inch of length. Your size carries into the
            builder, where you add your artwork.
          </p>
          <GangSheetCalculator
            instanceId="spotlight"
            layout="wide"
            showLearnMore={false}
          />
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

  .closer {
    margin: 3.5rem 0 0;
  }

  .closer-heading {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 700;
    letter-spacing: -0.02em;
    color: ${theme.color.text};
  }

  .closer-lede {
    margin: 0.5rem 0 1.25rem;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
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

  }
`;
