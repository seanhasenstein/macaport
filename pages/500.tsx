import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../components/Layout';

// Shown for any error thrown on the server: a database that cannot be reached,
// a missing environment variable, anything a page throws while rendering.
// Without this file every one of those served Vercel's own unbranded page, with
// no header, no way back into the site, and nothing telling someone whether the
// problem was theirs or ours.
//
// Deliberately depends on nothing. It renders while the database is down, so it
// cannot fetch, and Layout only brings the header and footer, which are static.
//
// The copy says the fault is ours and that the thing they wanted probably still
// exists. Someone looking for their team's store needs to know to come back,
// not to conclude the store was taken down.
export default function Custom500() {
  return (
    <Layout title="Something went wrong">
      <Custom500Styles>
        <div className="container">
          <div className="row">
            <h2>500</h2>
            <h3>Something went wrong on our end.</h3>
          </div>
          <p>
            This one is ours, not yours. Nothing you were looking for has gone
            away — try again in a few minutes and it should be back.
          </p>
          <div className="actions">
            <Link href="/stores">
              <a>Find your store</a>
            </Link>
            <Link href="/contact">
              <a className="quiet">Tell us about it</a>
            </Link>
          </div>
        </div>
      </Custom500Styles>
    </Layout>
  );
}

const Custom500Styles = styled.div`
  padding: 8rem 1.5rem 6rem;
  width: 100%;
  display: flex;
  justify-content: center;

  .container {
    max-width: 34rem;
    text-align: center;
  }

  .row {
    display: flex;
    justify-content: center;
    align-items: center;
  }

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
    text-align: left;
  }

  p {
    margin: 1.5rem 0 0;
    font-size: 0.9375rem;
    line-height: 1.6;
    color: #6b7280;
  }

  .actions {
    margin: 2.5rem 0 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 1rem 1.5rem;

    a {
      padding: 0.75rem 2rem;
      height: 2.625rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #282d34;
      color: #fff;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.011em;
      line-height: 1;
      border: 1px solid #181a1e;
      border-radius: 0.25rem;
      transition: all 150ms ease-in-out;

      &:hover {
        background-color: #181a1e;
      }
    }

    a.quiet {
      padding: 0;
      height: auto;
      color: #4b5563;
      background: none;
      border: none;

      &:hover {
        color: #111827;
        background: none;
      }
    }
  }

  @media (max-width: 600px) {
    padding: 5rem 1.5rem 4rem;

    .row {
      flex-direction: column;
    }

    h2 {
      margin: 0 0 0.5rem;
      padding: 0 0 0.5rem;
      border-right: none;
      border-bottom: 1px solid #d1d5db;
    }

    h3 {
      text-align: center;
    }
  }
`;
