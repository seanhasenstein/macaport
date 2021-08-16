import React from 'react';
import styled from 'styled-components';
import { format } from 'date-fns';
import { GetServerSideProps } from 'next';
import { connectToDb, store } from '../../../db';
import { Store as StoreInterface, Product } from '../../../interfaces';
import { MessageStyles } from '../../../styles/Message';
import StoreLayout from '../../../components/store/StoreLayout';
import StoreItem from '../../../components/store/StoreItem';

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
        {store.closeDate && (
          <div className="row">
            <div className="close-date">
              <svg
                xmlns="http://www.w3.org/2000/svg"
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
              <span>
                This store will close on{' '}
                {format(new Date(store.closeDate), 'EEE. LLL do, yyyy')} at
                Midnight (CT).
              </span>
            </div>
          </div>
        )}
        <h2>{store.name}</h2>
        {!store.products || store.products.length < 1 ? (
          <div className="no-products">
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
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              This store currently has no products.
            </div>
          </div>
        ) : (
          <div className="items">
            {store.products.map((p: Product) => (
              <StoreItem key={p.id} item={p} storeId={store._id} />
            ))}
          </div>
        )}
      </StoreStyles>
    </StoreLayout>
  );
}

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

    const now = new Date();
    const storeIsActive = !storeRes.closeDate
      ? true
      : new Date(storeRes.closeDate) > now;

    if (!storeIsActive) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-closed',
        },
      };
    }

    return { props: { store: storeRes } };
  } catch (err) {
    return {
      props: { error: err.message },
    };
  }
};

const StoreStyles = styled.div`
  padding: 2.5rem 0 4rem;
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

  .row {
    padding: 0 1.5rem;
    display: flex;
    justify-content: center;
  }

  .close-date {
    margin: 0 0 2.25rem;
    padding: 0.375rem 0.625rem;
    display: inline-flex;
    align-items: center;
    text-align: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
    background-color: #fff;
    border-radius: 0.3125rem;
    border: 1px solid #e5e7eb;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    svg {
      margin: 0 0.375rem 0 0;
      flex-shrink: 0;
      height: 1.125rem;
      width: 1.125rem;
      color: #f43f5e;
    }
  }

  .no-products {
    margin: 0 auto;
    padding: 0 1.5rem;
    max-width: 60rem;
    width: 100%;

    .wrapper {
      margin: 3rem 0;
      padding: 1.5rem 0 1.875rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-size: 1rem;
      color: #6e788c;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      border-bottom: 1px solid #e5e7eb;
    }

    svg {
      margin: 0 0 0.5rem;
      height: 1.5rem;
      width: 1.5rem;
      color: #f87171;
    }
  }

  .items {
    margin: 5rem auto 0;
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
    padding: 1.5rem 0 4rem;

    .close-date {
      padding: 1rem 1.25rem;
      align-items: flex-start;
      text-align: left;
      line-height: 1.5;

      span {
        margin: 0 auto;
        max-width: 22rem;
      }

      svg {
        margin: 0 0.625rem 0 0;
        height: 1.375rem;
        width: 1.375rem;
      }
    }

    .items {
      margin: 3.25rem 0 0;
    }
  }
`;
