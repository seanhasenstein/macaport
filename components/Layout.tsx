import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import { GlobalStyles } from '../styles/GlobalStyles';
import Header from './Header';
import Footer from './Footer';

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({
  children,
  title = 'Macaport | Screen Printing Company',
}: Props) {
  return (
    <LayoutStyles>
      <GlobalStyles />
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </LayoutStyles>
  );
}

const LayoutStyles = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
