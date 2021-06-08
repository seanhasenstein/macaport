import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { stores } from '../../data';
import { Store as StoreInterface, Item } from '../../interfaces';
import { formatDate } from '../../utils';
import StoreLayout from '../../components/store/StoreLayout';
import StoreItem from '../../components/store/StoreItem';
import { MessageStyles } from '../../styles/Message';

type Props = {
  store: StoreInterface;
  active: boolean;
  error?: string;
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

export default function Store({ store, error }: Props) {
  if (error) {
    return (
      <StoreLayout>
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
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3>Error</h3>
            <p>{error}</p>
            <Link href="/stores">
              <a className="button">See all available stores</a>
            </Link>
          </div>
        </MessageStyles>
      </StoreLayout>
    );
  }

  return (
    <StoreLayout
      title={`${store.name} | Macaport`}
      storeId={store.id}
      storeSlug={store.slug}
    >
      <StoreStyles>
        <h2>{store.name}</h2>
        {store.closeDate === null ? null : (
          <p>
            This store closes on {formatDate(store.closeDate)} at midnight (CT).
          </p>
        )}
        <div className="items">
          {store.products.map((p: Item) => (
            <StoreItem key={p.id} item={p} storeSlug={store.slug} />
          ))}
        </div>
      </StoreStyles>
    </StoreLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const store = stores.find(s => s.slug === context.query.slug);

    if (!store) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-not-found',
        },
      };
    }

    const now = new Date();
    const storeIsActive =
      store.closeDate === null ? true : new Date(store.closeDate) > now;

    if (!storeIsActive) {
      return {
        redirect: {
          permanent: false,
          destination: '/store-closed',
        },
      };
    }

    return { props: { store } };
  } catch (err) {
    return {
      props: { error: err.message },
    };
  }
};
