import Link from 'next/link';
import styled from 'styled-components';

export function Success() {
  return (
    <SuccessStyles>
      <div className="wrapper">
        <div className="content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3>Message Sent!</h3>
          <p>
            Thank you for contacting Macaport. We will be with you as soon as we
            can.
          </p>
          <Link href="/">
            <a className="button">Back to home</a>
          </Link>
        </div>
      </div>
    </SuccessStyles>
  );
}

const SuccessStyles = styled.div`
  margin: 0 auto;
  padding: 5rem 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;

  .wrapper {
    margin: 0 auto;
    padding: 0 2rem;
    max-width: 38rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    text-align: center;
  }

  .content {
    padding: 2.5rem 0;
    max-width: 26rem;
    width: 100%;
  }

  .icon {
    margin: 0;
    height: 3rem;
    width: 3rem;
    color: #10b981;
  }

  h3 {
    margin: 0.25rem 0 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 0 0 1.5rem;
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .button {
    padding: 0.75rem 2rem;
    display: inline-flex;
    justify-content: center;
    background-color: #22272f;
    color: #fff;
    font-size: 1rem;
    font-weight: 500;
    border-radius: 0.25rem;
    text-align: center;
    transition: all 200ms ease-in-out;

    &:hover {
      background-color: #323a46;
      color: rgba(255, 255, 255, 1);
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2563eb 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  @media (max-width: 500px) {
    padding: 4rem 1.5rem;

    .wrapper {
      background: transparent;
      box-shadow: none;
    }

    .content {
      padding: 0;
    }

    h3 {
      margin: 0.25rem 0 1.5rem;
    }

    p {
      margin: 0 0 2rem;
    }

    .button {
      width: 100%;
    }
  }
`;
