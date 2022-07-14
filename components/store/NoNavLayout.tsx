import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styled from 'styled-components';
import { GlobalStyles } from '../../styles/GlobalStyles';
import Footer from '../../components/Footer';

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
          <div className="nav-wrapper">
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
      <Footer />
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
    background-color: #fff;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: rgb(0 0 0 / 0%) 0px 0px 0px 0px, rgb(0 0 0 / 0%) 0px 0px 0px 0px,
      rgb(0 0 0 / 5%) 0px 1px 2px 0px;
  }

  .nav-wrapper {
    margin: 0 auto;
    padding: 0.875rem 0;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .logo {
    width: 12rem;
  }

  @media (max-width: 500px) {
    .logo {
      width: 9rem;
    }
  }
`;
