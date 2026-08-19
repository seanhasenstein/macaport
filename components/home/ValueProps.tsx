import styled from 'styled-components';
// The 20px solid set, used at the size it is drawn for. Heroicons only ships
// outline at 24, and at this scale an outline glyph loses its interior detail
// and reduces the white in the row to a few thin lines — on an all-green band
// these chips are the only bright element there is.
import {
  MapPinIcon,
  Square3Stack3DIcon,
  SwatchIcon,
} from '@heroicons/react/20/solid';
import { theme } from '../../styles/theme';

// Local rather than a theme token: this exists only because the band behind it
// is tinted, and it would be wrong anywhere else on the site.
const BODY_ON_TINT = '#3f6b50';

// Three reasons to pick Macaport, written as what the customer gets rather
// than how the shop does it — nobody outside the trade is moved by the name
// of the printing process.
const PROPS = [
  {
    id: 'minimums',
    Icon: Square3Stack3DIcon,
    // Scoped to apparel: this sits directly under a card advertising a 12"
    // minimum sheet, and an unqualified "no minimums" reads as a contradiction.
    title: 'No apparel minimums',
    body: 'Order a single piece or a thousand. Buy exactly what you need, when you need it.',
  },
  {
    id: 'color',
    Icon: SwatchIcon,
    title: 'Full-color printing',
    body: 'Ten colors cost the same as one. Print your artwork exactly as designed.',
  },
  {
    id: 'location',
    Icon: MapPinIcon,
    title: 'Based in New London, WI',
    body: 'Founded and operated in New London. For customers across Wisconsin and nationwide.',
  },
];

export default function ValueProps() {
  return (
    <ValuePropsStyles>
      <ul className="wrapper">
        {PROPS.map(({ id, Icon, title, body }) => (
          <li key={id}>
            <span className="icon" aria-hidden="true">
              <Icon />
            </span>
            <div>
              <h2>{title}</h2>
              <p>{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </ValuePropsStyles>
  );
}

// Tinted rather than white so it reads as its own band and not as the first of
// four white ones. Brand green because it is the one color the site already
// owns; sunken grey would have been the obvious choice but that tone now
// belongs to the gang sheet section, where it marks the only thing on the page
// a customer can finish without talking to anyone.
const ValuePropsStyles = styled.section`
  padding: 0 1.5rem;
  background-color: ${theme.color.brandSubtle};
  /* Both edges, drawn by the band rather than inherited from its neighbours.
     Every other section on the page carries only a bottom border and lets the
     one above supply its top, which works while they are all the same colour.
     This one is not, so relying on the hero's grey rule left it with a neutral
     lid and a green floor.

     A step stronger than the grey hairline between white sections: a neutral
     rule on a green ground reads as a seam, and brandBorder is too faint to
     hold a line this long. */
  border-top: 1px solid ${theme.color.brandBorderStrong};
  border-bottom: 1px solid ${theme.color.brandBorderStrong};

  .wrapper {
    margin: 0 auto;
    padding: 0;
    width: 100%;
    max-width: ${theme.maxWidth};
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    list-style-type: none;
  }

  /* The vertical padding lives on the items rather than the wrapper so the
     dividers run the full height of the band instead of stopping at the text. */
  li {
    padding: 2.25rem 2rem;
    display: flex;
    align-items: flex-start;
    gap: 0.875rem;

    & + li {
      border-left: 1px solid ${theme.color.brandBorderStrong};
    }

    &:first-child {
      padding-left: 0;
    }

    &:last-child {
      padding-right: 0;
    }
  }

  .icon {
    flex-shrink: 0;
    height: 2rem;
    width: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    /* Solid, not tinted. These were a brandSubtle chip on white, which is the
       band's own color now — left as they were they would have dissolved into
       it and taken the only shape in the row with them. */
    background-color: ${theme.color.brand};
    border: 1px solid ${theme.color.brand};
    border-radius: ${theme.radius.sm};

    svg {
      height: 1.0625rem;
      width: 1.0625rem;
      color: ${theme.color.onBrand};
    }
  }

  h2 {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 700;
    letter-spacing: -0.008em;
    color: ${theme.color.brandDeep};
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    line-height: 1.5;
    /* Not textMuted. That is 4.37:1 against this band — it clears AA on white
       but not here, and this is 14px body copy, so it needs 4.5:1. This green
       reads as the same family as the heading above it and measures 5.64:1. */
    color: ${BODY_ON_TINT};
  }

  @media (max-width: 900px) {
    /* Stacked, and the items keep carrying the vertical padding exactly as
       they do on desktop — the rules between them run edge to edge only if the
       space around each one belongs to the items it separates.

       No grid gap. It used to set the space above each divider while the item
       below set the space underneath, so one gap was drawn by two unrelated
       properties and neither could be adjusted without the other going out of
       true. */
    .wrapper {
      /* 0.5rem here plus the 1.5rem on the first and last items gives the band
         2rem at each edge, a little tighter than the 2.25rem desktop gets. */
      padding: 0.5rem 0;
      grid-template-columns: 1fr;
    }

    /* Symmetric, so every divider sits centred in its own gap: 1.5rem below the
       item above it, 1.5rem above the item below. The horizontal zeroes hand
       side spacing back to the section's own padding, which is the only thing
       that should set it once there is a single column. */
    li,
    li:first-child,
    li:last-child {
      padding: 1.5rem 0;
    }

    li + li {
      border-left: none;
      border-top: 1px solid ${theme.color.brandBorderStrong};
    }
  }
`;
