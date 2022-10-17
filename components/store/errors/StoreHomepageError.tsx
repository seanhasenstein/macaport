import { MessageStyles } from 'styles/Message';
import StoreLayout from '../StoreLayout';

export default function StoreHomepageError() {
  return (
    <StoreLayout title="Error | Macaport">
      <MessageStyles>
        <div className="wrapper">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3>An error has occurred</h3>
          <p>
            If you continue to have problems please contact us at{' '}
            <a href="mailto:support@macaport.com">support@macaport.com</a>.
          </p>
        </div>
      </MessageStyles>
    </StoreLayout>
  );
}
