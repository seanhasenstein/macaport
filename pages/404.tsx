import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../components/Layout';

export default function Custom404() {
  return (
    <Layout>
      <Custom404Styles>
        <div className="container">
          <div className="row">
            <h2>404</h2>
            <h3>This page could not be found.</h3>
          </div>
          <div className="actions">
            <Link href={'/stores'}>See available stores</Link>
          </div>
        </div>
      </Custom404Styles>
    </Layout>
  );
}

const Custom404Styles = styled.div`
  padding: 12rem 0 0;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  h2 {
    margin: 0 1.25rem 0 0;
    padding: 0 1.5rem 0 0;
    font-size: 1.5rem;
    font-weight: 600;
    border-right: 1px solid #d1d5db;
  }

  h3 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 500;
  }

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .actions {
    margin: 3rem 0 0;
    display: flex;
    justify-content: center;

    a {
      padding: 0.75rem 2rem;
      height: 2.625rem;
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #282d34;
      color: rgba(255, 255, 255, 0.9);
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.011em;
      line-height: 1;
      border: 1px solid #181a1e;
      border-radius: 0.25rem;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      cursor: pointer;
      transition: all 150ms ease-in-out;

      &:hover {
        background-color: #202329;
        color: rgba(255, 255, 255, 1);
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible {
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #4f46e5 0px 0px 0px 4px,
          rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }
  }

  @media (max-width: 375px) {
    padding: 6rem 0 0;

    .row {
      flex-direction: column;
    }

    h2 {
      margin: 0 0 1rem;
      padding: 00;
      font-size: 1.5rem;
      font-weight: 600;
      border-right: none;
    }

    .actions {
      margin: 1.5rem 0 0;
    }
  }
`;
