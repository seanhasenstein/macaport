import Link from 'next/link';
import styled from 'styled-components';
import GangSheetCalculator from './GangSheetCalculator';
import {
  theme,
  badge,
  focusRing,
  gridBackdrop,
  reducedMotion,
} from '../../styles/theme';

export default function Hero() {
  return (
    <HeroStyles>
      <div className="wrapper">
        <div className="text-content">
          {/* Kept alongside the location item in ValueProps below: this is the
              quick tag, that one is the substantiation. They earn the overlap
              only as long as the strip says something the badge doesn't. */}
          <p className="eyebrow">Wisconsin based &middot; Shipping nationwide</p>
          {/* Gang sheets are not named here on purpose: the subhead below only
              covers apparel and stores, and the card beside this says DTF GANG
              SHEETS above the fold. Left column = the conversation you start,
              card = the thing you can just buy. */}
          <h1>Custom apparel and team stores.</h1>
          {/* Two deliberate omissions. Gang sheets belong to the card on the
              right, and the no-minimums / full-color / Wisconsin claims belong
              to the ValueProps strip below, where they are scannable. What is
              left is what this paragraph is uniquely for: what we make, and
              the two ways to buy it. */}
          <p className="lede">
            Custom printed shirts, hoodies, hats, and other apparel. Order
            direct, or open an online store so your group can order on their
            own.
          </p>
          {/* Both land on the contact form. The `about` param tells it which
              set of follow-up questions to ask, so a lead arrives with the
              details already attached instead of a bare "I want shirts". */}
          {/* One button per side of the hero. The store path stays reachable
              as a text link and from the Stores nav item; two buttons here
              plus the card's CTA was three competing actions in one viewport. */}
          <div className="actions">
            <Link href="/contact?about=apparel">
              <a className="action">Get an apparel quote</a>
            </Link>
            <Link href="/contact?about=team-store">
              <a className="action-link">
                Ask about an online store{' '}
                <span aria-hidden="true">&rarr;</span>
              </a>
            </Link>
          </div>
        </div>

        <div className="calculator">
          <GangSheetCalculator />
        </div>
      </div>
    </HeroStyles>
  );
}

const HeroStyles = styled.section`
  padding: 0 1.5rem;
  border-bottom: 1px solid ${theme.color.border};
  ${gridBackdrop()}

  .wrapper {
    margin: 0 auto;
    padding: 5rem 0 5.5rem;
    width: 100%;
    max-width: ${theme.maxWidth};
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: 4rem;
  }

  .text-content {
    max-width: 36rem;
  }

  .eyebrow {
    ${badge}
    margin: 0 0 1.25rem;
  }

  h1 {
    margin: 0;
    font-size: 3rem;
    line-height: 1.08;
    font-weight: 700;
    color: ${theme.color.text};
    letter-spacing: -0.033em;
    text-wrap: balance;
  }

  .lede {
    margin: 1.25rem 0 0;
    max-width: 32rem;
    font-size: 1.0625rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
  }

  .actions {
    margin: 1.75rem 0 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.5rem;
  }

  .action-link {
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${theme.color.textMuted};
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

  /* Three colors for three destinations, so nothing competes: green is the
     apparel quote, neutral is the builder handoff in the card, outlined is
     the quieter team store ask. */
  .action {
    padding: 0.6875rem 1.125rem;
    display: inline-flex;
    align-items: center;
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${theme.color.onBrand};
    background-color: ${theme.color.brandHover};
    border: 1px solid ${theme.color.brandHover};
    border-radius: ${theme.radius.md};
    transition: border-color 150ms ease, color 150ms ease,
      background-color 150ms ease;
    ${reducedMotion}

    &:hover {
      background-color: ${theme.color.brandDeep};
      border-color: ${theme.color.brandDeep};
    }

    &:focus-visible {
      ${focusRing}
    }
  }

  .calculator {
    display: flex;
    justify-content: flex-end;
  }

  @media (max-width: 950px) {
    .wrapper {
      padding: 3.5rem 0 4rem;
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    h1 {
      font-size: 2.25rem;
    }

    .calculator {
      justify-content: flex-start;
    }
  }

  @media (max-width: 480px) {
    h1 {
      font-size: 1.875rem;
    }

    .lede {
      font-size: 1rem;
    }

    .calculator {
      justify-content: stretch;
    }
  }
`;
