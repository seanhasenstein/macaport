import styled from 'styled-components';
import { theme } from '../../styles/theme';

type Props = {
  serverError: boolean;
};

export default function ServerError(props: Props) {
  return props.serverError ? (
    <ServerErrorStyles>
      Internal server error. Please try sending again. If this problem continues
      you can contact us at{' '}
      <a href="mailto:support@macaport.com">support@macaport.com</a>.
    </ServerErrorStyles>
  ) : null;
}

const ServerErrorStyles = styled.div`
  margin: 1.25rem 0 0;
  padding: 0.875rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.55;
  color: ${theme.color.danger};
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: ${theme.radius.md};

  a {
    text-decoration: underline;
    text-underline-offset: 3px;
  }
`;
