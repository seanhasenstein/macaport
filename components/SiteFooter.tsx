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
    id: 'services',
    title: 'Services',
    links: [
      { id: 'apparel', text: 'Custom apparel', href: '/#apparel' },
      { id: 'team-stores', text: 'Online team stores', href: '/#team-stores' },
      { id: 'onsite', text: 'Onsite printing', href: '/#onsite-printing' },
      { id: 'gang-sheets', text: 'DTF gang sheets', href: '/#gang-sheets' },
    ],
  },
  // Split out of Services rather than for length alone. These two need nobody
  // on the Macaport side: a parent finds their store and orders, a shop builds
  // a sheet and checks out. Everything above starts with a conversation, and
  // team stores and gang sheets each appear once as what they are and once as
  // something to go and do.
  {
    id: 'shop',
    title: 'Shop',
    links: [
      { id: 'stores', text: 'Find your store', href: '/stores' },
      {
        id: 'builder',
        text: 'Build a gang sheet',
        href: 'https://sheets.macaport.com/editor',
        external: true,
      },
      // Storefronts, not marketing pages. Each is a Momentec catalog embedded
      // whole, browsed and ordered through without anyone at Macaport being
      // involved until the order reaches Nick's dashboard.
      {
        id: 'sublimation',
        text: 'Sublimation',
        href: '/sublimation-customization',
      },
      { id: 'headwear', text: 'Headwear', href: '/headwear-customization' },
    ],
  },
  // The contact links live together rather than inside Shop. Shop means the
  // things nobody at Macaport has to be involved in, and a quote request is
  // the opposite of that. Each ?about= lands on the form with the right
  // questions already showing, which is the whole reason to link them
  // separately instead of pointing four times at the same page.
  {
    id: 'quotes',
    title: 'Get in touch',
    links: [
      {
        id: 'quote-apparel',
        text: 'Get an apparel quote',
        href: '/contact?about=apparel',
      },
      {
        id: 'quote-store',
        text: 'Ask about an online store',
        href: '/contact?about=team-store',
      },
      // No ?about= yet: onsite printing has no path on the form. Pointing at
      // one that does not exist would preselect nothing and silently drop the
      // context, so it goes to the general form until that path is built.
      { id: 'quote-onsite', text: 'Ask about onsite printing', href: '/contact' },
      { id: 'contact', text: 'Contact us', href: '/contact' },
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
              Custom printing and embroidery for schools, teams, businesses,
              and events. Made in New London, Wisconsin.
            </p>
            <address>
              3080 Frederick Farm Ln. Suite 101
              <br />
              New London, WI 54961
            </address>
          </div>

          <nav className="groups" aria-label="Footer">
            {groups.map(group => (
              <div key={group.id}>
                <h2>{group.title}</h2>
                <ul>
                  {group.links.map(link => (
                    <li key={link.id}>
                      {/* The builder is a different application on its own subdomain, so
                          it gets a plain anchor. Routed through next/link it would try to
                          handle an absolute URL client-side and would lose target and rel. */}
                      {link.external ? (
                        <a href={link.href} target="_blank" rel="noreferrer">
                          {link.text}
                        </a>
                      ) : (
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
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </nav>
        </div>

        {/* Privacy and terms sit here rather than in a column. Nobody browses
            a footer looking for a privacy policy; they look at the very bottom
            of the page, which is also where they stop competing for attention
            with the things someone might actually want. */}
        <div className="bottom">
          <p>
            &copy; Macaport {new Date().getFullYear()}. All Rights Reserved.
          </p>
          <div className="bottom-links">
            <Link href="/privacy-policy">
              <a>Privacy policy</a>
            </Link>
            <Link href="/terms-and-conditions">
              <a>Terms &amp; conditions</a>
            </Link>
            <a href="mailto:support@macaport.com">support@macaport.com</a>
          </div>
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

  /* Browsers italicise address by default, which reads as emphasis nobody
     asked for on a street address. */
  .brand address {
    /* More than the gap between the logo and the blurb: those are one thought,
       and the address is a separate fact underneath it. */
    margin: 2rem 0 0;
    font-size: 0.875rem;
    font-style: normal;
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
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem 1.5rem;
    border-top: 1px solid ${theme.color.border};

    p {
      margin: 0;
      font-size: 0.8125rem;
      color: ${theme.color.textSubtle};
    }

    .bottom-links {
      display: flex;
      flex-wrap: wrap;
      /* Wide enough that three links at the same size and colour read as three
         things rather than one run of grey text. */
      gap: 0.375rem 2rem;
    }

    a {
      font-size: 0.8125rem;
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
