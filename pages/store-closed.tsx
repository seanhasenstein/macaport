import NoNavLayout from '../components/store/NoNavLayout';
import { MessageStyles } from '../styles/Message';

export default function StoreClosed() {
  return (
    <NoNavLayout>
      <MessageStyles>
        <div className="content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3>Store Closed</h3>
          <p>
            This store is currently closed. Please contact us with any questions
            at <a href="mailto:info@macaport.com">info@macaport.com</a>.
          </p>
        </div>
      </MessageStyles>
    </NoNavLayout>
  );
}
