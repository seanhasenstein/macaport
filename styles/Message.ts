import styled from 'styled-components';

export const MessageStyles = styled.div`
  margin: 5rem auto;
  padding: 0 2rem;
  max-width: 38rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fff;
  border-radius: 0.25rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  text-align: center;

  .content {
    padding: 2.5rem 0;
    max-width: 26rem;
    width: 100%;
  }

  .icon {
    margin: 0;
    height: 3rem;
    width: 3rem;
    color: #ef4444;
  }

  h3 {
    margin: 1rem 0 1rem;
    font-size: 1.25rem;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 0 0 1.5rem;
    font-size: 1.125rem;
    color: #6b7280;
    line-height: 1.5;

    a {
      color: #3b82f6;
      text-decoration: underline;
    }
  }

  .button {
    padding: 0.75rem 2rem;
    display: inline-flex;
    justify-content: center;
    background-color: #22272f;
    color: rgba(255, 255, 255, 0.9);
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

  @media (max-width: 700px) {
    padding: 0rem 1.5rem;
    background: transparent;
    box-shadow: none;

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
