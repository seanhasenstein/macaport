import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { scrollToHash } from '../utils/scroll';
import { theme, focusRing, reducedMotion } from '../styles/theme';

// Marketing footer, used only by components/Layout.tsx.
//
// components/Footer.tsx stays as the minimal copyright line for the store
// layouts. Store and checkout pages shouldn't grow a marketing nav.

const groups = [
  {
    id: 'shop',
    title: 'Shop',
    links: [
      { id: 'gang-sheets', text: 'DTF gang sheets', href: '/#gang-sheets' },
      // Two different things: the explainer section, and the live stores you
      // can actually order from today.
      { id: 'team-stores', text: 'How team stores work', href: '/#team-stores' },
      { id: 'stores', text: 'Open team stores', href: '/stores' },
      {
        id: 'sublimation',
        text: 'Sublimation',
        href: '/sublimation-customization',
      },
      { id: 'headwear', text: 'Headwear', href: '/headwear-customization' },
    ],
  },
  {
    id: 'company',
    title: 'Company',
    links: [
      { id: 'contact', text: 'Contact us', href: '/contact' },
      { id: 'privacy', text: 'Privacy policy', href: '/privacy-policy' },
      {
        id: 'terms',
        text: 'Terms & conditions',
        href: '/terms-and-conditions',
      },
    ],
  },
];

export default function SiteFooter() {
  const router = useRouter();

  return (
    <SiteFooterStyles>
      <div className="wrapper">
        <div className="top">
          <div className="brand">
            <Link href="/">
              <a className="logo">
                <img src="/images/logo.png" alt="Macaport" />
              </a>
            </Link>
            <p>
              Custom apparel, embroidery, online team stores, and DTF gang
              sheets out of New London, Wisconsin.
            </p>
          </div>

          <nav className="groups" aria-label="Footer">
            {groups.map(group => (
              <div key={group.id}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map(link => (
                    <li key={link.id}>
                      <Link href={link.href}>
                        <a
                          href={link.href}
                          onClick={event => {
                            if (scrollToHash(link.href, router)) {
                              event.preventDefault();
                            }
                          }}
                        >
                          {link.text}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h2>Visit</h2>
              <address>
                Macaport LLC
                <br />
                3080 Frederick Farm Ln. Suite 101
                <br />
                New London, WI 54961
                <br />
                <a href="mailto:support@macaport.com">support@macaport.com</a>
              </address>
              {/* Hours go here once confirmed. */}
            </div>
          </nav>
        </div>

        <div className="bottom">
          <p>
            &copy; Macaport {new Date().getFullYear()}. All Rights Reserved.
          </p>
        </div>
      </div>
    </SiteFooterStyles>
  );
}

const SiteFooterStyles = styled.footer`
  margin-top: auto;
  padding: 0 1.5rem;
  width: 100%;
  background-color: ${theme.color.surface};
  border-top: 1px solid ${theme.color.border};

  .wrapper {
    margin: 0 auto;
    padding: 3.5rem 0 2rem;
    max-width: ${theme.maxWidth};
    width: 100%;
  }

  .top {
    display: grid;
    grid-template-columns: minmax(0, 18rem) minmax(0, 1fr);
    gap: 3rem;
  }

  .logo {
    display: inline-block;
    max-width: 11rem;

    img {
      width: 100%;
    }

    &:focus-visible {
      ${focusRing}
      border-radius: ${theme.radius.sm};
    }
  }

  .brand p {
    margin: 1rem 0 0;
    font-size: 0.875rem;
    line-height: 1.6;
    color: ${theme.color.textMuted};
  }

  .groups {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 2rem;
  }

  h2 {
    margin: 0 0 0.875rem;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: ${theme.color.text};
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  li {
    margin: 0 0 0.5rem;
  }

  address {
    font-size: 0.875rem;
    font-style: normal;
    line-height: 1.7;
    color: ${theme.color.textMuted};
  }

  a {
    font-size: 0.875rem;
    color: ${theme.color.textMuted};
    transition: color 150ms ease;
    ${reducedMotion}

    &:hover {
      color: ${theme.color.brand};
    }

    &:focus-visible {
      ${focusRing}
      border-radius: ${theme.radius.sm};
    }
  }

  .bottom {
    margin: 3rem 0 0;
    padding: 1.5rem 0 0;
    border-top: 1px solid ${theme.color.border};

    p {
      margin: 0;
      font-size: 0.8125rem;
      color: ${theme.color.textSubtle};
    }
  }

  @media (max-width: 900px) {
    .top {
      grid-template-columns: 1fr;
      gap: 2.5rem;
    }

    .groups {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 2rem;
    }
  }

  @media (max-width: 480px) {
    .groups {
      grid-template-columns: 1fr;
      gap: 1.75rem;
    }

    .bottom {
      margin-top: 2rem;
    }
  }
`;
