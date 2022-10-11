import styled from 'styled-components';

export default function Footer() {
  return (
    <FooterStyles>
      <div className="footer-wrapper">
        <p>&copy; Macaport {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </FooterStyles>
  );
}

const FooterStyles = styled.footer`
  margin-top: auto;
  padding: 0 1.5rem;
  width: 100%;
  text-align: center;

  .footer-wrapper {
    margin: 0 auto;
    padding: 2rem 0;
    max-width: 69rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    border-top: 1px solid #c6cbd2;
  }

  p {
    margin: 0;
    color: #595f6b;
    font-size: 0.875rem;
  }
`;
