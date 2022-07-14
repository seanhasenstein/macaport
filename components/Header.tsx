import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';

type NavItemProps = {
  text: string;
  href: string;
};

function NavItem({ text, href }: NavItemProps) {
  return (
    <li>
      <Link href={href}>
        <a>{text}</a>
      </Link>
    </li>
  );
}

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false);

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
          <ul className={isOpen ? 'open' : ''}>
            <NavItem text="Home" href="/" />
            <NavItem text="Ink Colors" href="/#colors" />
            <NavItem text="Stores" href="/stores" />
            <NavItem text="Contact Us" href="/contact" />
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
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

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
      padding: 0 1.75rem;

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

  @media (max-width: 950px) {
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
