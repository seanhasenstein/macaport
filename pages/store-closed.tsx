import NoNavLayout from '../components/store/NoNavLayout';
import styled from 'styled-components';

export default function StoreClosed() {
  return (
    <NoNavLayout>
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
            This store is currently closed. Please contact us with any questions
            at <a href="mailto:support@macaport.com">support@macaport.com</a>.
          </p>
        </div>
      </StoreClosedStyles>
    </NoNavLayout>
  );
}

const StoreClosedStyles = styled.div`
  margin: 6rem 0;
  padding: 0 1.5rem;

  .wrapper {
    padding: 1.875rem 0 2.5rem;
    max-width: 40rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
  }

  svg {
    margin: 0 0 0.5rem;
    height: 1.75rem;
    width: 1.75rem;
    color: #f87171;
  }

  h3 {
    margin: 0.5rem 0 0.75rem;
    font-size: 1.125rem;
    font-weight: 600;
    color: #1f2937;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #6e788c;
    line-height: 1.5;
  }

  a {
    color: #3b82f6;
    text-decoration: underline;

    &:hover {
      color: #2563eb;
    }
  }
`;
