import React from 'react';
import Head from 'next/head';
import { createGlobalStyle } from 'styled-components';
import Header from './Header';
import Footer from './Footer';

const GlobalStyles = createGlobalStyle`
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/Inter-Regular.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Regular.woff?v=3.18") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/Inter-Medium.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Medium.woff?v=3.18") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/Inter-SemiBold.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-SemiBold.woff?v=3.18") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/Inter-Bold.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Bold.woff?v=3.18") format("woff");
}

html,
  body {
  padding: 0;
  margin: 0;
  font-size: 16px;
  letter-spacing: -0.011em;
  background-color: #F9FAFB;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "cv02","cv03","cv04","cv09", "cv11";
}

html, body, button, input, textarea {
  font-family: 'Inter',-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
}

.sr-only {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}
`;

type Props = {
  children: React.ReactNode;
  title?: string;
};

export default function Layout({
  children,
  title = 'Macaport | Screen Printing Company',
}: Props) {
  return (
    <>
      <GlobalStyles />
      <Head>
        <title>{title}</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <Header />
      {children}
      <Footer />
    </>
  );
}
