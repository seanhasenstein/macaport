import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { scrollToHash } from '../utils/scroll';

type NavItemProps = {
  text: string;
  href: string;
};

function NavItem({ text, href }: NavItemProps) {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (scrollToHash(href, router)) event.preventDefault();
  };

  return (
    <li>
      <Link href={href}>
        {/* href is repeated so this stays a real link without JS. Next
            overwrites it with the same value when it clones the child. */}
        <a href={href} onClick={handleClick}>
          {text}
        </a>
      </Link>
    </li>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  // Close the mobile menu once navigation lands. Without this, the "Gang
  // Sheets" anchor scrolls the homepage while the open menu still covers it.
  React.useEffect(() => {
    const close = () => setIsOpen(false);
    router.events.on('routeChangeComplete', close);
    router.events.on('hashChangeComplete', close);

    return () => {
      router.events.off('routeChangeComplete', close);
      router.events.off('hashChangeComplete', close);
    };
  }, [router.events]);

  return (
    <HeaderStyles>
      <div>
        <nav role="navigation">
          <div className="top-row">
            <div className="logo">
              <Link href="/">
                <a>
                  <img src="/images/logo.png" alt="Macaport" />
                </a>
              </Link>
            </div>
            <button
              className="button"
              aria-expanded={isOpen}
              aria-controls="menu"
              onClick={() => setIsOpen(!isOpen)}
            >
              <span className="sr-only">Menu</span>
              {isOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
          {/* The four services first, then the two things a returning visitor
              comes back to do. Sublimation and headwear moved to the footer: they
              are Momentec storefronts rather than services, and they were taking
              two of five slots while custom apparel, team stores and onsite
              printing had none. Anchors for now; they become page links as each
              page is built, and nothing else has to change. */}
          <ul className={isOpen ? 'open' : ''}>
            <NavItem text="Custom Apparel" href="/#apparel" />
            <NavItem text="Team Stores" href="/#team-stores" />
            <NavItem text="Onsite Printing" href="/#onsite-printing" />
            <NavItem text="Gang Sheets" href="/#gang-sheets" />
            <NavItem text="Contact" href="/contact" />
          </ul>
        </nav>
      </div>
    </HeaderStyles>
  );
}

const HeaderStyles = styled.header`
  margin: 0 auto;
  padding: 1.125rem 1.5rem;
  width: 100%;
  background-color: #fff;
  /* Positioned so the shadow actually paints. The next section down is
     position: relative with its own background, which would otherwise paint
     straight over it — the shadow was invisible at any opacity. */
  position: relative;
  z-index: 1;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.07), 0 1px 2px -1px rgb(0 0 0 / 0.07);

  nav {
    margin: 0 auto;
    max-width: 72rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    ul {
      margin: 0;
      padding: 0;
      display: flex;
      list-style-type: none;
    }

    li {
      /* Five items at 1.75rem needed about 1010px to stay on one line, which
         is more than the breakpoint below allowed, so between 950 and 1010 the
         nav wrapped onto two rows. Trimmed here and the breakpoint raised, so
         the menu takes over before the links ever have to wrap. */
      padding: 0 1.5rem;

      &:last-of-type {
        padding-right: 0;
      }
    }

    a {
      font-size: 1rem;
      font-weight: 500;
      color: #3f4a5d;

      &:hover {
        color: #07090b;
      }
    }
  }

  .logo {
    width: 12.25rem;

    img {
      width: 100%;
    }
  }

  .button {
    display: none;
  }

  @media (max-width: 1024px) {
    nav {
      flex-direction: column;
      align-items: flex-start;

      ul {
        display: none;
        margin: 1.25rem 0 0;
        width: 100%;
        flex-direction: column;
        align-items: center;

        &.open {
          display: flex;
        }
      }

      li {
        padding: 0;
        width: 100%;
        border-top: 1px solid #f3f4f6;

        a {
          display: block;
          padding: 1rem 0;
        }
      }
    }

    .top-row {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .logo {
      padding: 0;
      width: 14rem;
    }

    .button {
      margin: 0;
      padding: 0.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: transparent;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;

      svg {
        height: 1.75rem;
        width: 1.75rem;
        color: #1f2937;
      }
    }
  }
`;
