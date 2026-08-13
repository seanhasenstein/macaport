import styled from 'styled-components';
import { theme } from '../../styles/theme';

type Props = {
  serverError: boolean;
  // Set when the message was refused for a reason we can name. A throttled
  // sender is far more likely to be a real person on a shared connection than
  // an attacker, so they get told what happened and a way through it rather
  // than a generic failure they cannot act on.
  throttled?: boolean;
};

export default function ServerError({ serverError, throttled }: Props) {
  if (!serverError) return null;

  return (
    <ServerErrorStyles>
      {throttled
        ? 'Too many messages have been sent from your network in the last few minutes. Wait a moment and try again, or email us directly at '
        : 'Internal server error. Please try sending again. If this problem continues you can contact us at '}
      <a href="mailto:support@macaport.com">support@macaport.com</a>.
    </ServerErrorStyles>
  );
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
