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

type DropdownProps = {
  text: string;
  items: NavItemProps[];
  /** True once the mobile menu is showing, where this flattens to a heading
   *  and its links rather than staying a control. */
  isMobile: boolean;
};

// Click to open, not hover. Hover has no touch equivalent, so a hover menu
// needs a click fallback anyway — and once click works everywhere, hover only
// adds a way to open it by accident on the way to something else.
function NavDropdown({ text, items, isMobile }: DropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const container = React.useRef<HTMLLIElement>(null);
  const button = React.useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // Following a link inside the menu does not unmount the header, so without
  // this the menu is still hanging open on the page you just navigated to.
  React.useEffect(() => {
    const close = () => setIsOpen(false);
    router.events.on('routeChangeComplete', close);
    router.events.on('hashChangeComplete', close);

    return () => {
      router.events.off('routeChangeComplete', close);
      router.events.off('hashChangeComplete', close);
    };
  }, [router.events]);

  React.useEffect(() => {
    if (!isOpen) return;

    // Escape returns focus to the button. Without that, closing from inside
    // the menu drops focus onto the body and a keyboard user restarts at the
    // top of the page.
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      setIsOpen(false);
      button.current?.focus();
    };

    // pointerdown rather than click: a click listener fires after the browser
    // has already moved focus, so tabbing away and clicking behaved
    // differently. Also catches a drag that starts outside.
    const onPointerDown = (event: PointerEvent) => {
      if (container.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    // focusin closes it when focus leaves by keyboard, which neither of the
    // above sees.
    const onFocusIn = (event: FocusEvent) => {
      if (container.current?.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('focusin', onFocusIn);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('focusin', onFocusIn);
    };
  }, [isOpen]);

  // On a phone the header is already an expanded list with room to spare, so a
  // menu inside a menu is a second thing to open for no gain. The items sit
  // inline under a heading instead.
  if (isMobile) {
    return (
      <>
        <li className="group-heading" aria-hidden="true">
          {text}
        </li>
        {items.map(item => (
          <NavItem key={item.href} {...item} />
        ))}
      </>
    );
  }

  return (
    <li className="dropdown" ref={container}>
      <button
        ref={button}
        type="button"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(open => !open)}
      >
        {text}
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      {isOpen && (
        <ul className="menu">
          {items.map(item => (
            <NavItem key={item.href} {...item} />
          ))}
        </ul>
      )}
    </li>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();
  // Tracked in JS as well as CSS because the two layouts are different markup,
  // not the same markup restyled: on a phone the dropdown flattens into its
  // items. Starts false so the server and the first client render agree, then
  // corrects on mount — a mismatch here would be a hydration error.
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const query = window.matchMedia('(max-width: 1024px)');
    const sync = () => setIsMobile(query.matches);

    sync();
    query.addEventListener('change', sync);

    return () => query.removeEventListener('change', sync);
  }, []);

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
          {/* Services first, then Shop, then Contact. Shop holds the things a
              visitor can complete without anyone at Macaport — two Momentec
              storefronts and the store finder — which is the same split the
              footer uses. It exists because those three could not each have a
              top-level slot: six items wrap on the narrow half of the desktop
              range, which is what the padding below was already fighting.

              Onsite printing moved into the homepage at Nick's request. It is
              still in the footer and still a contact path. */}
          <ul className={isOpen ? 'open' : ''}>
            <NavItem text="Custom Apparel" href="/#apparel" />
            <NavItem text="Team Stores" href="/#team-stores" />
            <NavItem text="Gang Sheets" href="/#gang-sheets" />
            <NavDropdown
              text="Shop"
              isMobile={isMobile}
              items={[
                { text: 'Find your store', href: '/stores' },
                { text: 'Sublimation', href: '/sublimation-customization' },
                { text: 'Headwear', href: '/headwear-customization' },
              ]}
            />
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

  /* Sits in the flow like any other item, with the menu taken out of it so the
     header keeps its height when open. */
  .dropdown {
    position: relative;

    > button {
      padding: 0;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-family: inherit;
      font-size: 1rem;
      font-weight: 500;
      color: #3f4a5d;
      background: none;
      border: none;
      cursor: pointer;

      &:hover {
        color: #07090b;
      }

      svg {
        height: 1rem;
        width: 1rem;
      }
    }

    > button[aria-expanded='true'] {
      color: #07090b;

      svg {
        transform: rotate(180deg);
      }
    }
  }

  .menu {
    position: absolute;
    top: calc(100% + 0.75rem);
    /* Aligned to the button rather than centred: the items are wider than the
       word Shop, and centring pushed the last one past the header's edge. */
    left: -0.75rem;
    z-index: 2;
    min-width: 12rem;
    padding: 0.375rem 0;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.08),
      0 12px 24px -8px rgb(0 0 0 / 0.12);

    li {
      padding: 0;
      width: 100%;

      &:last-of-type {
        padding-right: 0;
      }
    }

    a {
      display: block;
      padding: 0.5rem 1.125rem;
      white-space: nowrap;

      &:hover {
        background-color: #f8f9fa;
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

      /* Labels the flattened group without being a control. aria-hidden in the
         markup, because a screen reader gets nothing from a word that does
         nothing — the links below it stand on their own. */
      .group-heading {
        padding: 1.25rem 0 0.375rem;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #9ca3af;
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
