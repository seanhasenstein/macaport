import Link from 'next/link';
import styled from 'styled-components';

export default function Footer() {
  return (
    <FooterStyles>
      <div className="footer-wrapper">
        <p>&copy; Macaport {new Date().getFullYear()}. All Rights Reserved.</p>
        <div className="nav">
          <Link href="/">
            <a>Home</a>
          </Link>
          <div className="divider" arria-hidden="true" />
          <Link href="/terms-and-conditions">Terms &amp; conditions</Link>
          <div className="divider" arria-hidden="true" />
          <Link href="/privacy-policy">Privacy policy</Link>
        </div>
      </div>
    </FooterStyles>
  );
}

const FooterStyles = styled.footer`
  margin-top: auto;
  padding: 0 1.5rem;
  width: 100%;
  text-align: center;

  p {
    margin: 0;
    color: #6b7280;
    font-size: 0.875rem;
  }

  .footer-wrapper {
    margin: 0 auto;
    padding: 2.5rem 0;
    max-width: 72rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #d1d5db;
  }

  .nav {
    display: flex;
    justify-content: center;

    a {
      font-size: 0.875rem;
      font-weight: 600;
      color: #334155;
      transition: color 100ms linear;

      &:hover {
        color: #0f172a;
      }
    }
  }

  .divider {
    margin: 0 1.75rem;
    height: 1rem;
    width: 1px;
    background-color: #cbd5e1;
  }

  @media (max-width: 768px) {
    .footer-wrapper {
      flex-direction: column;
    }

    .nav {
      margin: 3rem 0 0;
    }
  }

  @media (max-width: 640px) {
    .footer-wrapper {
      padding-top: 0;
      flex-direction: column-reverse;
      border-top: none;
    }

    .nav {
      margin: 0 0 3rem;
      flex-direction: column;
      text-align: center;
      width: 100%;
      background-color: #fff;
      border-top: 1px solid #e2e8f0;
      border-radius: 0.25rem;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);

      a {
        padding: 1rem 0;
        width: 100%;
        border-bottom: 1px solid #e2e8f0;

        &:last-of-type {
          border-bottom: none;
        }
      }
    }

    .divider {
      display: none;
    }
  }
`;
