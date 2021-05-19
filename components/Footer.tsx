import styled from 'styled-components';

const FooterStyles = styled.footer`
  padding: 2rem 0;
  width: 100%;
  background-color: #111827;

  .wrapper {
    margin: 0 auto;
    max-width: 64rem;
    width: 100%;
  }

  p {
    margin: 0;
    color: #747c8b;
    font-size: 0.875rem;
  }
`;

export default function Footer() {
  return (
    <FooterStyles>
      <div className="wrapper">
        <p>&copy; Macaport {new Date().getFullYear()}. All Rights Reserved.</p>
      </div>
    </FooterStyles>
  );
}
