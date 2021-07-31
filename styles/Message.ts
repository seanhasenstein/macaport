import styled from 'styled-components';

export const MessageStyles = styled.div`
  margin: 6rem 0;
  padding: 0 1.5rem;

  .wrapper {
    margin: 0 auto;
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
