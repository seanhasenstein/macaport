import styled from 'styled-components';
import {
  MapPinIcon,
  Square3Stack3DIcon,
  SwatchIcon,
} from '@heroicons/react/20/solid';
import { theme } from '../../styles/theme';

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

const ValuePropsStyles = styled.section`
  padding: 0 1.5rem;
  background-color: ${theme.color.surface};
  border-bottom: 1px solid ${theme.color.border};

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
      border-left: 1px solid ${theme.color.border};
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
    background-color: ${theme.color.brandSubtle};
    border: 1px solid ${theme.color.brandBorder};
    border-radius: ${theme.radius.sm};

    svg {
      height: 1.0625rem;
      width: 1.0625rem;
      color: ${theme.color.brand};
    }
  }

  h2 {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 700;
    letter-spacing: -0.008em;
    color: ${theme.color.text};
  }

  p {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    line-height: 1.5;
    color: ${theme.color.textMuted};
  }

  @media (max-width: 900px) {
    .wrapper {
      padding: 2rem 0;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    li,
    li:first-child,
    li:last-child {
      padding: 0;

      & + li {
        padding-top: 1.5rem;
        border-left: none;
        border-top: 1px solid ${theme.color.border};
      }
    }
  }
`;
