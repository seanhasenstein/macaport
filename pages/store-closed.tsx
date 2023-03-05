import Link from 'next/link';
import NoNavLayout from '../components/store/layouts/NoNavLayout';
import styled from 'styled-components';

export default function StoreClosed() {
  return (
    <NoNavLayout title="Store closed">
      <StoreClosedStyles>
        <div className="wrapper">
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
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3>Store Closed</h3>
          <p>
            The store you're looking for is closed. Please contact us with any
            questions at{' '}
            <a href="mailto:support@macaport.com">support@macaport.com</a>.
          </p>
          <Link href="/stores">
            <a className="link-button">See available stores</a>
          </Link>
        </div>
      </StoreClosedStyles>
    </NoNavLayout>
  );
}

const StoreClosedStyles = styled.div`
  padding: 4.5rem 1.5rem;
  display: flex;
  justify-content: center;

  .wrapper {
    padding: 1.875rem 1.5rem 2.5rem;
    max-width: 32rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    background-color: #fff;
    border-radius: 0.375rem;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(17, 24, 39, 0.05) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.1) 0px 4px 6px -1px, rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
  }

  svg {
    margin: 0 0 0.375rem;
    height: 1.625rem;
    width: 1.625rem;
    color: #e31e42;
  }

  h3 {
    margin: 0.25rem 0 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 0 auto;
    max-width: 26rem;
    width: 100%;
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.5;

    a {
      color: #4f46e5;
      text-decoration: underline;
    }
  }

  .link-button {
    margin: 1.25rem 0 0;
    padding: 0.625rem 1.5rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1f2937;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 0.011em;
    border-radius: 0.375rem;
    cursor: pointer;

    &:hover {
      background-color: #111827;
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

  @media (max-width: 500px) {
    padding: 1.5rem;
  }
`;
