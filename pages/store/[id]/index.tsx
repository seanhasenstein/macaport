import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { connectToDb, store as storeModel } from 'db';
import { Store as Store, StoreProduct } from '../../../interfaces';
import StoreLayout from '../../../components/store/layouts/StoreLayout';
import StoreItem from '../../../components/store/home/StoreItem';
import { getUrlParameter } from 'utils';
import { getStoreStatus } from 'utils/store';
import StoreHomepageError from 'components/store/errors/StoreHomepageError';

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = getUrlParameter(context.query.id);

    if (!id) {
      throw new Error("A store id is required but wasn't provided");
    }

    const db = await connectToDb();
    const store = await storeModel.getStoreById(db, id);

    if (!store) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-not-found',
        },
      };
    }

    const isStoreActive = getStoreStatus(store.openDate, store.closeDate);

    if (isStoreActive === false) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-closed',
        },
      };
    }

    return { props: { store } };
  } catch (error) {
    return {
      props: { error },
    };
  }
};

type Props = {
  store: Store;
  error?: string;
};

export default function StoreHomepage({ store, error }: Props) {
  if (error) {
    return <StoreHomepageError />;
  }

  return (
    <StoreLayout title={`${store.name}`}>
      <StoreStyles>
        <div className="store-header">
          {store.closeDate && (
            <div className="close-date">
              <span>
                This store will close on{' '}
                {format(
                  new Date(store.closeDate),
                  "eee. LLL. do, yyyy 'at' h:mmaaa"
                )}
              </span>
            </div>
          )}
          <h2 className="store-name">
            <span>{store.name}</span>
          </h2>
        </div>
        {!store.products || store.products.length < 1 ? (
          <div className="no-products">
            <div className="wrapper">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
              <p>
                This store currently has no products available. Contact us with
                any questions at{' '}
                <a href="mailto:support@macaport.com">support@macaport.com</a>.
              </p>
            </div>
          </div>
        ) : (
          <div className="items">
            {store.products.map((p: StoreProduct) => (
              <StoreItem key={p.id} item={p} storeId={store._id} />
            ))}
          </div>
        )}
      </StoreStyles>
    </StoreLayout>
  );
}

const StoreStyles = styled.div`
  position: relative;
  margin: 4rem 0 0;

  .store-name,
  p {
    text-align: center;
  }

  .close-date {
    padding: 0 1.5rem;
    display: flex;
    justify-content: center;

    span {
      padding: 0.5rem 1.25rem;
      font-size: 0.9375rem;
      font-weight: 500;
      color: #7f1d1d;
      text-align: center;
      line-height: 1.5;
      background-color: #fee2e2;
      border-radius: 0.1875rem;
      border: 1px solid #fecaca;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }
  }

  .store-name {
    margin: 3.25rem auto 0;
    padding: 0 1.5rem;
    font-size: 1.625rem;
    color: #111827;
    line-height: 1.35;
  }

  p {
    margin: 0 auto;
    padding: 0 1.5rem;
    max-width: 32rem;
    width: 100%;
    color: #6e788c;
    line-height: 1.5;
  }

  .no-products {
    margin: 0 auto;
    padding: 0 1.5rem;
    max-width: 60rem;
    width: 100%;

    .wrapper {
      margin: 3rem 0;
      padding: 1.5rem 1.5rem 2rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }

    p {
      font-size: 1rem;
      color: #4b5563;
      text-align: center;

      a {
        color: #4f46e5;
        text-decoration: underline;
      }
    }

    svg {
      margin: 0 0 0.5rem;
      height: 1.5rem;
      width: 1.5rem;
      color: #ec4763;
    }
  }

  .items {
    margin: 4rem auto 3rem;
    padding: 0 1.5rem;
    max-width: 72rem;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(296px, 1fr));
    gap: 2.5rem 1.5rem;
    justify-content: center;
  }

  @media (max-width: 1024px) {
    .items {
      padding: 0 1.5rem;
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 640px) {
    margin: 3rem 0 0;

    .items {
      margin: 3.75rem 0 0;
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }
`;
