import { GetServerSideProps } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { connectToDb, store } from '../db';
import { getStoreStatus } from '../utils/store';
import { StoreForStoresPage } from '../interfaces';
import Layout from '../components/Layout';

export const getServerSideProps: GetServerSideProps = async () => {
  const db = await connectToDb();
  const stores = await store.getStoresForStoresPage(db);
  const activeStores = stores?.filter(s => {
    const isActive = getStoreStatus(s.openDate, s.closeDate);
    return isActive;
  });

  const res = activeStores || null;

  return { props: { stores: res } };
};

type Props = {
  stores: StoreForStoresPage[];
};

export default function Stores(props: Props) {
  return (
    <Layout>
      <StoresStylesV2>
        <div className="wrapper">
          <h2 className="page-title">Current stores</h2>
          {(!props.stores || props.stores.length < 1) && (
            <div className="empty">There are currently no active stores.</div>
          )}
          {props.stores && props.stores.length > 0 && (
            <div className="stores-grid">
              {props.stores.map(store => (
                <div key={store._id} className="store">
                  <h3 className="store-name">{store.name}</h3>
                  <p className="close-date">
                    {store.closeDate ? (
                      <span>
                        Closes <br />
                        {format(
                          new Date(store.closeDate),
                          "LLL. do, yyyy 'at' h:mmaaa"
                        )}
                      </span>
                    ) : (
                      'Permanently Open'
                    )}
                  </p>
                  <Link key={store._id} href={`/store/${store._id}`}>
                    <a className="store-link">Visit store</a>
                  </Link>
                </div>
              ))}
            </div>
          )}
          <div className="interest-container">
            <h4>Are you interested in opening an online store?</h4>
            <Link href="/contact">
              <a className="contact-link">Send us a message</a>
            </Link>
          </div>
        </div>
      </StoresStylesV2>
    </Layout>
  );
}

const StoresStylesV2 = styled.div`
  padding: 1.5rem 1.5rem 0;

  .wrapper {
    margin: 0 auto;
    padding: 4rem 0;
    max-width: 72rem;
    width: 100%;
  }

  .page-title {
    margin: 0;
    font-size: 1.75rem;
    text-align: center;
    letter-spacing: -0.0125em;
  }

  .stores-grid {
    margin: 4rem 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(22rem, 1fr));
    gap: 3rem 2rem;
  }

  .store {
    padding: 2.5rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 0.125rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }

  .store-name {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
    text-align: center;
  }

  .close-date {
    margin: 1.25rem 0 0;
    min-height: 3.5rem;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 500;
    color: #595f6b;
    text-align: center;
    line-height: 1.85;
  }

  .store-link {
    margin: 1.75rem 0 0;
    padding: 0.625rem 1rem;
    width: 100%;
    font-size: 0.875rem;
    font-weight: 500;
    color: #f9fafb;
    text-align: center;
    background-color: #1f2937;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    transition: background-color 100ms linear;

    &:hover {
      background-color: #111827;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2563eb 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .interest-container {
    margin: 3rem 0 0;
    padding: 3rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);

    h4 {
      margin: 0 auto;
      max-width: 20rem;
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      text-align: center;
      line-height: 1.5;
    }

    .contact-link {
      margin: 1.625rem 0 0;
      padding: 0.625rem 1.5rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      background-color: #148653;
      font-size: 0.9375rem;
      font-weight: 600;
      color: #fff;
      border-radius: 0.25rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1),
        0 2px 4px -2px rgb(0 0 0 / 0.1);
      transition: background-color 150ms linear;

      &:hover {
        background-color: #127549;
      }

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible {
        box-shadow: #fff 0px 0px 0px 2px, #2563eb 0px 0px 0px 4px,
          rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }
  }
`;
