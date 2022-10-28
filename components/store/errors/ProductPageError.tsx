import Link from 'next/link';
import { MessageStyles } from 'styles/Message';
import StoreLayout from '../layouts/StoreLayout';

type Props = {
  error: string;
  storeId: string;
};

export default function ProductPageError(props: Props) {
  return (
    <StoreLayout title="Error">
      <MessageStyles>
        <div className="wrapper">
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
            <h3>Error</h3>
            <p>{props.error}</p>
            <Link href={`/store/${props.storeId}`}>
              <a className="button">Back to store home</a>
            </Link>
          </div>
        </div>
      </MessageStyles>
    </StoreLayout>
  );
}
