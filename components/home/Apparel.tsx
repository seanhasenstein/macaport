import Link from 'next/link';
import styled from 'styled-components';
import { theme, focusRing, reducedMotion } from '../../styles/theme';

// Not numbered: these are three parallel facts about the same service, not
// steps in a process. The numbered lists elsewhere on the page are sequences.
const details = [
  {
    id: 'decoration',
    title: 'Printing or embroidery',
    body: 'Full-color printing for detailed artwork and photos, or embroidery when you want a stitched finish.',
  },
  {
    id: 'sizing',
    title: 'Youth through 4XL',
    body: 'The same design across the whole size range, so nobody on the roster ends up with something different.',
  },
  {
    id: 'garments',
    title: 'Basics through name brands',
    body: 'Everyday tees and crewnecks up through Nike fleece, in the colors you want on each item.',
  },
];

export default function Apparel() {
  return (
    <ApparelStyles id="apparel">
      <div className="wrapper">
        <div className="intro">
          <p className="eyebrow">Custom apparel &amp; embroidery</p>
          <h2>Your artwork, printed or stitched, on the gear you pick.</h2>
          <p className="lede">
            Send us your design, or just an idea, and we&apos;ll put it on tees,
            hoodies, crewnecks, or hats. Most of what we make is for
            fundraisers, reunions, clubs, sports teams, and staff uniforms.
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

        <Link href="/contact?about=apparel">
          <a className="cta">Get an apparel quote</a>
        </Link>
      </div>
    </ApparelStyles>
  );
}

const ApparelStyles = styled.section`
  padding: 0 1.5rem;
  background-color: ${theme.color.surfaceMuted};
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
    border-top: 2px solid ${theme.color.text};
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

  .cta {
    margin: 3rem 0 0;
    padding: 0.875rem 1.75rem;
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
      background-color: ${theme.color.brandHover};
    }

    &:focus-visible {
      ${focusRing}
    }
  }

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

    .cta {
      margin-top: 2.25rem;
      width: 100%;
      justify-content: center;
    }
  }
`;
