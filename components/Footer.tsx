import styled from 'styled-components';

const FooterStyles = styled.footer`
  margin-top: auto;
  padding: 0 1.5rem;
  width: 100%;
  text-align: center;

  .wrapper {
    margin: 0 auto;
    padding: 1.75rem 0;
    max-width: 64rem;
    width: 100%;
    color: #6b7280;
    font-size: 0.875rem;
    border-top: 1px solid #e5e7eb;
  }
`;

export default function Footer() {
  return (
    <FooterStyles>
      <div className="wrapper">
        &copy; Macaport {new Date().getFullYear()}. All Rights Reserved.
      </div>
    </FooterStyles>
  );
}
