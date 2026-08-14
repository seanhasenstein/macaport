import styled from 'styled-components';
import { theme } from '../../styles/theme';

type Logo = {
  id: string;
  src: string;
  alt: string;
};

// Add entries here once permission to display each customer's mark is
// confirmed. The strip renders itself from this array, so no layout change is
// needed to turn it on.
const logos: Logo[] = [];

export default function TrustLine() {
  return (
    <TrustLineStyles>
      <div className="wrapper">
        {/* No "across Wisconsin" here — the ValueProps strip under the hero
            already makes the location claim, and saying it twice on one page
            reads as filler. This line is here to head the logo strip. */}
        <p className="trust">
          Printing for school teams, clubs, and businesses since 2019.
        </p>
        {logos.length > 0 && (
          <ul className="logos">
            {logos.map(logo => (
              <li key={logo.id}>
                <img src={logo.src} alt={logo.alt} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </TrustLineStyles>
  );
}

const TrustLineStyles = styled.section`
  padding: 0 1.5rem;
  background-color: ${theme.color.surface};
  border-bottom: 1px solid ${theme.color.border};

  .wrapper {
    margin: 0 auto;
    padding: 3rem 0;
    width: 100%;
    max-width: ${theme.maxWidth};
    text-align: center;
  }

  .trust {
    margin: 0;
    font-size: 0.9375rem;
    font-weight: 500;
    color: ${theme.color.textMuted};
    letter-spacing: -0.005em;
  }

  .logos {
    margin: 2rem 0 0;
    padding: 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 2.5rem;
    list-style-type: none;

    img {
      max-height: 2.75rem;
      width: auto;
    }
  }

  @media (max-width: 600px) {
    .wrapper {
      padding: 2.25rem 0;
    }

    .logos {
      gap: 1.5rem;
    }
  }
`;
