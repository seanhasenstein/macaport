import styled from 'styled-components';

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
  margin: 1.25rem auto 0;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5rem;
  color: #b91c1c;
  text-align: center;

  a {
    text-decoration: underline;
  }
`;
