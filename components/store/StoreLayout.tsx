import React, { ReactNode } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { GlobalStyles } from '../../styles/GlobalStyles';

type Props = {
  children: ReactNode;
  title?: string;
};

export default function StoreLayout({
  children,
  title = 'Macaport Store',
}: Props) {
  const router = useRouter();

  return (
    <LayoutStyles>
      <GlobalStyles />
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <header>
        <nav>
          <div className="wrapper">
            <Link href={`/store/${router.query.id}`}>
              <a title="Store Home">
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
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </a>
            </Link>
            <Link href={`/store/${router.query.id}`}>
              <a>
                <img
                  src="/images/logo.png"
                  alt="Macaport text with mountains"
                  className="logo"
                />
              </a>
            </Link>
            {router.asPath.includes('cart') ? (
              <Link href={`/store/${router.query.id}/checkout`}>
                <a title="Checkout">
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                </a>
              </Link>
            ) : (
              <Link href={`/store/${router.query.id}/cart`}>
                <a title="Cart">
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
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </a>
              </Link>
            )}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <div className="wrapper">
          <div className="copyright">
            &copy; Macaport {new Date().getFullYear()}. All Rights Reserved.
          </div>
        </div>
      </footer>
    </LayoutStyles>
  );
}

const LayoutStyles = styled.div`
  position: relative;
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;

  nav {
    padding: 0 1.5rem;
    position: relative;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 5%) 0px 1px 2px 0px;

    .wrapper {
      margin: 0 auto;
      padding: 0.875rem 0;
      max-width: 90rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    svg {
      height: 1.5rem;
      width: 1.5rem;
      color: #545c6b;
    }

    a:hover svg {
      color: #181a1e;
    }

    .logo {
      width: 12rem;
    }

    @media (max-width: 500px) {
      .logo {
        width: 9rem;
      }
    }
  }

  footer {
    margin: 3rem 0 0;
    padding: 0 1.5rem;

    .wrapper {
      margin: 0 auto;
      padding: 1.75rem 0;
      max-width: 90rem;
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #e5e7eb;
    }

    .copyright {
      font-size: 0.9375rem;
      color: #6b7280;
      text-align: center;
    }
  }
`;
