import Link from 'next/link';
import styled from 'styled-components';
import BrowserFrame from '../ui/BrowserFrame';
import { theme, focusRing, reducedMotion } from '../../styles/theme';

const steps = [
  {
    id: '01',
    title: 'We build your store',
    body: 'Tell us your group and send us your artwork. We go through garment options with you, set up the products, colors, and sizes, and put your logo on the store page.',
  },
  {
    id: '02',
    title: 'Everyone orders on their own',
    body: 'Share one link. Each person picks their own size, adds their own name or number, and pays for their own order. Nobody collects cash, chases order forms, or fronts the money.',
  },
  {
    id: '03',
    title: 'We print and sort by person',
    body: 'When the store closes we print the exact quantities ordered and bag every order by name. No guessing on sizes, no leftover inventory to unload later.',
  },
];

const details = [
  {
    id: 'garments',
    title: 'Garments and brands',
    body: 'Basic tees and crewnecks through Nike fleece, in youth through 4XL, with the color options you want on each item.',
  },
  {
    id: 'personalization',
    title: 'Personalization',
    body: 'Let people add a name or a number on the back of an item, priced per add on, or turn it off entirely.',
  },
  {
    id: 'dates',
    title: 'Open and close dates',
    body: 'Pick when the store opens and closes and we print once it closes, or leave it open permanently and order on a schedule that suits you.',
  },
];

export default function TeamStores() {
  return (
    <TeamStoresStyles id="team-stores">
      <div className="wrapper">
        <div className="layout">
          <div className="intro">
            <p className="eyebrow">Online team stores</p>
            <h2>One link. Everyone orders for themselves.</h2>
            <p className="lede">
              Most of our stores are for school sports teams, clubs, and booster
              groups. The part that usually eats an organizer&apos;s whole month
              is collecting sizes, collecting money, and sorting the box when it
              arrives. That is the part we take over.
            </p>
            <Link href="/stores">
              <a className="secondary-link">
                Browse open stores
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </Link>
          </div>

          <div className="screenshot">
            <BrowserFrame
              src="/images/team-store-home.png"
              alt="A Macaport team store page for the New London Gridiron Club showing shirts, prices, color options, and the date the store closes"
              width={2000}
              height={1002}
              label="macaport.com/store"
            />
          </div>
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

        <div className="details">
          <div className="screenshot">
            <BrowserFrame
              src="/images/team-store-product.png"
              alt="A team store product page showing a Nike sweatshirt with color choices, sizes from XS to 4XL, and options to add a name or number on the back"
              width={2000}
              height={1002}
              label="macaport.com/store/product"
            />
          </div>

          <div className="details-content">
            <h3 className="details-heading">You choose what goes in it</h3>
            <ul>
              {details.map(detail => (
                <li key={detail.id}>
                  <h4>{detail.title}</h4>
                  <p>{detail.body}</p>
                </li>
              ))}
            </ul>
            <Link href="/contact">
              <a className="cta">Set up a store for your group</a>
            </Link>
            <p className="cta-note">
              Fundraisers, reunions, sports teams, clubs, and staff orders.
            </p>
          </div>
        </div>
      </div>
    </TeamStoresStyles>
  );
}

const TeamStoresStyles = styled.section`
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

  .layout {
    display: grid;
    grid-template-columns: minmax(0, 21rem) minmax(0, 1fr);
    align-items: center;
    gap: 3.5rem;
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
    font-size: 2rem;
    line-height: 1.15;
    font-weight: 700;
    color: ${theme.color.text};
    letter-spacing: -0.028em;
    text-wrap: balance;
  }

  .lede {
    margin: 1.125rem 0 0;
    font-size: 1rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
  }

  .secondary-link {
    margin: 1.5rem 0 0;
    padding: 0.25rem 0;
    display: inline-flex;
    align-items: center;
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${theme.color.text};
    border-bottom: 1px solid ${theme.color.borderStrong};
    transition: color 150ms ease, border-color 150ms ease;
    ${reducedMotion}

    svg {
      margin: 0 0 0 0.125rem;
      height: 1rem;
      width: 1rem;
    }

    &:hover {
      color: ${theme.color.brand};
      border-color: ${theme.color.brand};
    }

    &:focus-visible {
      ${focusRing}
      border-radius: ${theme.radius.sm};
      border-color: transparent;
    }
  }

  .steps {
    margin: 3.5rem 0 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2.5rem;
    list-style-type: none;
  }

  .steps > li {
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

  .details {
    margin: 4rem 0 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 24rem);
    align-items: center;
    gap: 3.5rem;
  }

  .details-heading {
    margin: 0;
    font-size: 1.375rem;
    font-weight: 700;
    color: ${theme.color.text};
    letter-spacing: -0.02em;
  }

  .details-content ul {
    margin: 1.5rem 0 0;
    padding: 0;
    list-style-type: none;
  }

  .details-content ul li {
    padding: 1rem 0;
    border-top: 1px solid ${theme.color.border};

    &:last-child {
      border-bottom: 1px solid ${theme.color.border};
    }
  }

  .details-content h4 {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 600;
    color: ${theme.color.text};
  }

  .details-content p {
    margin: 0.375rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
  }

  .cta {
    margin: 1.75rem 0 0;
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

  .cta-note {
    margin: 0.75rem 0 0;
    font-size: 0.8125rem;
    color: ${theme.color.textMuted};
  }

  @media (max-width: 900px) {
    .wrapper {
      padding: 3.5rem 0;
    }

    .layout,
    .details {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    .details {
      margin-top: 3rem;
    }

    h2 {
      font-size: 1.75rem;
    }

    .steps {
      margin-top: 2.5rem;
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }

    .cta {
      width: 100%;
      justify-content: center;
    }
  }
`;
