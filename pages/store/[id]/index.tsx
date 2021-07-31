import React from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { connectToDb, store } from '../../../db';
import { Store as StoreInterface, Item } from '../../../interfaces';
import { formatDate } from '../../../utils';
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
              {error} If you continue to have problems please contact us at{' '}
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
        <h2>{store.name}</h2>
        {store.closeDate === null ? null : (
          <p>
            This store closes on {formatDate(store.closeDate)} at midnight (CT).
          </p>
        )}
        {store.products.length < 1 ? (
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
            {store.products.map((p: Item) => (
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
  margin: 4rem auto;

  h2,
  p {
    text-align: center;
  }

  h2 {
    margin: 0 auto 1rem;
    padding: 0 1.5rem;
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
    margin: 4rem auto 0;
    padding: 0 1.5rem;
    max-width: 948px;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(284px, 1fr));
    gap: 2.5rem 1.5rem;
  }

  @media (max-width: 800px) {
    .items {
      padding: 0;
      grid-template-columns: 1fr 1fr;

      a:nth-of-type(odd) {
        border-radius: 0 0.25rem 0.25rem 0;
      }

      a:nth-of-type(even) {
        border-radius: 0.25rem 0 0 0.25rem;
      }
    }
  }
`;
