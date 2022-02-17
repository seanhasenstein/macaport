import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { connectToDb, store } from '../../../db';
import { Store as StoreInterface, StoreProduct } from '../../../interfaces';
import { isStoreActive } from '../../../utils';
import { MessageStyles } from '../../../styles/Message';
import StoreLayout from '../../../components/store/StoreLayout';
import StoreItem from '../../../components/store/StoreItem';

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const id = Array.isArray(context.query.id)
      ? context.query.id[0]
      : context.query.id;

    if (!id) {
      throw new Error('No store id provided.');
    }

    const { db } = await connectToDb();
    const storeRes = await store.getStoreById(db, id);

    if (!storeRes) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-not-found',
        },
      };
    }

    const storeIsActive = isStoreActive(storeRes.openDate, storeRes.closeDate);

    if (!storeIsActive) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-closed',
        },
      };
    }

    return { props: { store: storeRes } };
  } catch (error) {
    return {
      props: { error },
    };
  }
};

type Props = {
  store: StoreInterface;
  active: boolean;
  error?: string;
};

export default function Store({ store, error }: Props) {
  if (error) {
    return (
      <StoreLayout>
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

  return (
    <StoreLayout title={`${store.name} | Macaport`}>
      <StoreStyles>
        <div className="store-header">
          {store.closeDate && (
            <div className="close-date">
              <span>
                This store will close on{' '}
                {format(
                  new Date(store.closeDate),
                  "LLL. do, yyyy 'at' h:mmaaa"
                )}
              </span>
            </div>
          )}
          <h2>{store.name}</h2>
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
  padding: 0 0 5rem;
  position: relative;

  h2,
  p {
    text-align: center;
  }

  h2 {
    margin: 0 auto;
    padding: 0 1.5rem;
    font-size: 1.625rem;
    color: #111827;
  }

  p {
    margin: 0 auto;
    padding: 0 1.5rem;
    max-width: 32rem;
    width: 100%;
    color: #6e788c;
    line-height: 1.5;
  }

  .store-header {
    margin: 3.5rem 0 0;
  }

  .close-date {
    margin: 0 0 2.25rem;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    span {
      padding: 0.5rem 0.9375rem;
      background-color: #fef2f2;
      border-radius: 0.125rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: #991b1b;
      text-align: center;
      line-height: 1;
      border: 1px solid #fee2e2;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }
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
    margin: 4rem auto 0;
    padding: 0 1.5rem;
    max-width: 72rem;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(296px, 1fr));
    gap: 2.5rem 1.5rem;
    justify-content: center;
  }

  @media (max-width: 1000px) {
    .items {
      padding: 0 1.5rem;
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (max-width: 600px) {
    .items {
      padding: 0 0.75rem;
      gap: 1.5rem 0.75rem;
    }
  }

  @media (max-width: 500px) {
    padding: 0 0 4rem;

    h2 {
      margin: 2rem 0 0;
    }

    .store-header {
      margin: 1.5rem 0 0;
    }

    .items {
      margin: 3.25rem 0 0;
    }
  }

  @media (max-width: 375px) {
    padding: 0.5rem 0 0;

    .store-header {
      margin: 0;
    }

    .close-date {
      padding: 0;

      span {
        width: calc(100% - 1rem);
        line-height: 1.35;
      }
    }
  }
`;
