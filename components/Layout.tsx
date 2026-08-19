import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { GlobalStyles, MarketingGlobalStyles } from '../styles/GlobalStyles';
import useHashScroll from '../hooks/useHashScroll';
import Header from './Header';
import SiteFooter from './SiteFooter';

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

export default function Layout({
  children,
  title = 'Macaport | Custom Apparel & DTF Gang Sheets',
  description,
}: Props) {
  useHashScroll();

  return (
    <LayoutStyles>
      <GlobalStyles />
      <MarketingGlobalStyles />
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        {description && <meta name="description" content={description} />}
      </Head>
      <Header />
      <main>{children}</main>
      <SiteFooter />
    </LayoutStyles>
  );
}

const LayoutStyles = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;

  /* Not justify-content: space-between. That hands spare vertical space to the
     gaps between header, main, and footer, and those gaps are transparent, so
     on a viewport taller than the page a strip of the body's grey opened up
     directly above the footer. Giving main the spare space instead keeps the
     footer at the bottom with nothing showing through, and a page that wants
     to fill the window can stretch inside main with flex: 1. */
  main {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
`;
