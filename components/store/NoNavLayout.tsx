import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { GlobalStyles } from '../../styles/GlobalStyles';

type Props = {
  children: ReactNode;
  title?: string;
};

export default function NoNavLayout({ children, title = 'Macaport' }: Props) {
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
            <Link href="/">
              <a>
                <img
                  src="/images/logo.png"
                  alt="Macaport text with mountains"
                  className="logo"
                />
              </a>
            </Link>
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
  min-height: 100%;
  display: grid;
  grid-template-rows: auto 1fr auto;

  nav {
    padding: 0 1.5rem;
    position: relative;
    background-color: #f9fafb;
  }

  .wrapper {
    margin: 0 auto;
    padding: 0.875rem 0;
    max-width: 90rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
  }

  .logo {
    width: 12rem;
  }

  footer {
    margin: 0;
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

  @media (max-width: 500px) {
    .logo {
      width: 9rem;
    }
  }
`;
