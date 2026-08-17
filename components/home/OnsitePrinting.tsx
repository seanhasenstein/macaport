import Link from 'next/link';
import styled from 'styled-components';
import { theme, focusRing, reducedMotion } from '../../styles/theme';

// Deliberately short. The operational detail — what Macaport brings, what a
// venue has to provide, whether the organizer buys up front or attendees pay
// on the day — is not written down anywhere yet, and inventing it here would
// put claims on the homepage that nobody has agreed to. This says what the
// service is and sends the enquiry somewhere a person can answer it.
const details = [
  {
    id: 'events',
    title: 'Tournaments, fairs, and school events',
    body: 'Anywhere a crowd turns up and wants something to take home from the day.',
  },
  {
    id: 'setup',
    title: 'We bring the setup',
    body: 'Tell us the venue, the date, and the hours, and we will work out what fits.',
  },
  {
    id: 'onthespot',
    title: 'Printed while they wait',
    body: 'People pick a design on the day rather than ordering weeks ahead and hoping.',
  },
];

export default function OnsitePrinting() {
  return (
    <OnsitePrintingStyles id="onsite-printing">
      <div className="wrapper">
        <div className="intro">
          <p className="eyebrow">Onsite printing</p>
          <h2>We bring the press to your event.</h2>
          <p className="lede">
            Instead of taking orders in advance, we set up where the event is
            happening and print on the spot. Good for anything with a crowd and
            a date.
          </p>
        </div>

        <ul className="details">
          {details.map(detail => (
            <li key={detail.id}>
              <h3>{detail.title}</h3>
              <p>{detail.body}</p>
            </li>
          ))}
        </ul>

        <Link href="/contact?about=onsite">
          <a className="cta">Ask about onsite printing</a>
        </Link>
      </div>
    </OnsitePrintingStyles>
  );
}

const OnsitePrintingStyles = styled.section`
  padding: 0 1.5rem;
  background-color: ${theme.color.surface};
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
    text-wrap: pretty;
  }

  .details {
    margin: 3rem 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.5rem;
    list-style-type: none;
  }

  .details li {
    padding: 1.125rem 0 0;
    /* Twelve of these run down the page across the four sections, so their
       weight adds up fast. See borderRule in styles/theme.ts for why it is its
       own token rather than one of the text or border tones.

       The 2px is what keeps them structural at that tone — halved to 1px they
       would join the hairlines between sections and stop grouping anything. */
    border-top: 2px solid ${theme.color.borderRule};
  }

  .details h3 {
    margin: 0;
    font-size: 1.0625rem;
    font-weight: 600;
    color: ${theme.color.text};
    letter-spacing: -0.012em;
  }

  .details p {
    margin: 0.5rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
  }

  /* Identical to the apparel and team store buttons. This section was written
     later and picked up its own values: a smaller button carrying larger text
     in a darker green, resting on brandHover — which is where the other two
     land on hover, so hovering one of those made it the twin of this one
     sitting untouched. */
  .cta {
    margin: 3rem 0 0;
    padding: 0.875rem 1.75rem;
    display: inline-flex;
    align-items: center;
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${theme.color.onBrand};
    background-color: ${theme.color.brand};
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

  /* One breakpoint, matching the other three sections. The heading and the
     wrapper padding used to shift at 600px here while apparel, team stores and
     gang sheets shifted at 900 — so between those widths this section carried a
     2.25rem heading directly under a 1.75rem one, which read as an error rather
     than a difference. */
  @media (max-width: 900px) {
    .wrapper {
      padding: 3.5rem 0;
    }

    h2 {
      font-size: 1.75rem;
    }

    .details {
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }
  }
`;
