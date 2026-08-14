import Link from 'next/link';
import styled from 'styled-components';
import { theme, focusRing, reducedMotion } from '../../styles/theme';

// Not numbered: these are three parallel facts about the same service, not
// steps in a process. The numbered lists elsewhere on the page are sequences.
// The list a visitor is actually scanning, looking for their own item. Not a
// fourth card: the other three are claims and this is an inventory, and forcing
// thirteen names into a card shaped for two sentences reads as a wall.
// Ordered by what gets asked for, then grouped: tops, bottoms, headwear, bags.
// Hoodies and crewnecks outsell polos several times over for the fundraisers
// and teams this section is aimed at, so they come first.
const garments = [
  'T-shirts',
  'Long sleeves',
  'Hoodies',
  'Crewnecks',
  'Quarter zips',
  'Jackets',
  'Polos',
  'Jerseys',
  'Joggers',
  'Shorts',
  'Hats',
  'Beanies',
  'Bags',
];

const details = [
  {
    id: 'decoration',
    title: 'Printing and embroidery',
    body: 'Full-color printing for detailed artwork and photos, priced the same whether it uses one color or ten. Embroidery when you want a stitched finish instead.',
  },
  {
    id: 'sizing',
    title: 'Youth through 4XL',
    // Women's cuts are the most-asked question this page did not answer, and a
    // mixed-gender group has no way to know from anywhere else on the site.
    body: "The same design across the whole size range, so nobody on the roster ends up with something different. Women's cuts on most styles, and several brands go past 4XL.",
  },
  {
    id: 'garments',
    title: 'Basics through name brands',
    // Named in plain text, never as logo artwork. Describing goods we actually
    // sell is ordinary; the marks themselves belong to their owners and the
    // retail three restrict them to dealers with an agreement in writing.
    // Replaces "among others": buying through SanMar, S&S and Momentec means
    // the real range is their whole catalog, which is a far bigger promise
    // than a vague admission that the list is partial.
    body: 'Gildan, Port & Company and Sport-Tek for everyday pieces, up through Nike, Adidas and Under Armour. If you want something specific, we can usually source it.',
  },
];

export default function Apparel() {
  return (
    <ApparelStyles id="apparel">
      <div className="wrapper">
        <div className="intro">
          <p className="eyebrow">Custom apparel &amp; embroidery</p>
          <h2>Your artwork, printed or stitched, on whatever you pick.</h2>
          <p className="lede">
            Send us your design, or just an idea, and we&apos;ll put it on
            almost anything you can wear or carry. Most of what we make is for
            businesses, schools, sports teams, clubs, and events, from a single
            team to an entire district.
          </p>
        </div>

        <div className="range">
          <p className="range-label">What we print and stitch on</p>
          <ul className="range-list">
            {garments.map(garment => (
              <li key={garment}>{garment}</li>
            ))}
            {/* Thirteen names cannot be the whole catalogue, and someone who
                does not find theirs should not conclude the answer is no. */}
            <li className="more">and more</li>
          </ul>
        </div>

        {/* Photographs of finished work belong here once they exist: an
            embroidered piece, a full-colour print, a finished team order, and
            something that is not a shirt. This is the only section on the page
            with nothing visual, and the range is the hardest thing here to
            carry in words alone. */}

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

  .range {
    margin: 2.5rem 0 0;
  }

  .range-label {
    margin: 0 0 0.75rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${theme.color.textSubtle};
  }

  .range-list {
    margin: 0;
    padding: 0;
    max-width: 46rem;
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 0.5rem;
    list-style-type: none;
  }

  .range-list li {
    padding: 0.375rem 0.8125rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: ${theme.color.text};
    background-color: ${theme.color.surface};
    border: 1px solid ${theme.color.borderStrong};
    border-radius: 999px;
  }

  /* No separators now each item has an edge of its own. */
  .range-list li.more {
    padding-left: 0.25rem;
    font-weight: 400;
    color: ${theme.color.textMuted};
    background: none;
    border: none;
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
