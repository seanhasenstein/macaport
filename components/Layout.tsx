import React from 'react';
import Head from 'next/head';
import styled, { createGlobalStyle } from 'styled-components';
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
  height: 100%;
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

#__next {
  height: 100%;
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

label {
  margin: 0 0 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6e788c;
}

input, select {
  appearance: none;
  background-color: #fff;
  border: 1px solid #dddde2;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}

input {
  padding: 0.625rem 0.75rem;
}

select {
  padding: 0 2.5rem 0 0.75rem;
  height: 42px;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-size: 1.375em 1.375em;
  background-repeat: no-repeat;
  color-adjust: exact;
  border: 1px solid #dddde2;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #36383e;
  cursor: pointer;
}

select:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(65, 141, 203, 0.2);
  border-color: #8faef4;
}

@media (max-width: 500px) {
  input, select {
    font-size: 1rem;
  }
}

@media print {
  body {
    background-color: #fff;
  }

  header, footer {
    display: none;
  }
}
`;

const LayoutStyles = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
