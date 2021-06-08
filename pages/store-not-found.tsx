import Link from 'next/link';
import NoNavLayout from '../components/store/NoNavLayout';
import { MessageStyles } from '../styles/Message';

export default function StoreNotFound() {
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
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3>Store Not Found</h3>
          <p>The store you are looking for does not exist.</p>
          <Link href="/stores">
            <a className="button">See all available stores</a>
          </Link>
        </div>
      </MessageStyles>
    </NoNavLayout>
  );
}
