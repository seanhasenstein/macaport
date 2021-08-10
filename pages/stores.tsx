import { GetServerSideProps } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { connectToDb, store } from '../db';
import { Store } from '../interfaces';
import Layout from '../components/Layout';

type Props = {
  stores: Store[];
};

const StoresStyles = styled.div`
  padding: 0 1.5rem;

  .wrapper {
    margin: 0 auto;
    padding: 4rem 0;
    max-width: 64rem;
    width: 100%;
  }

  h2 {
    margin: 0;
    font-size: 1.5rem;
  }

  p {
    margin: 1rem 0 0;
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.5;
    max-width: 32rem;
  }

  .grid {
    margin: 2rem 0;
  }

  .header,
  .item {
    grid-template-columns: 1fr 1fr 6rem;
  }

  .header {
    padding: 0 0 0.75rem;
    display: grid;
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.0375em;
    border-bottom: 1px solid #e5e7eb;
  }

  .item {
    padding: 0.75rem 0;
    display: grid;
    grid-template-columns: 1fr 1fr auto;
    align-items: center;
    gap: 0.25rem 0.5rem;
    font-size: 0.9375rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .store-link {
    display: inline-flex;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
    color: #4338ca;
    border-bottom: 1px solid transparent;

    svg {
      margin: 0 0 0 0.1875rem;
      height: 1rem;
      width: 1rem;
      color: #4f46e5;
    }

    &:hover {
      border-color: #4f46e5;
    }
  }

  @media (max-width: 700px) {
    .header {
      display: none;
    }

    .item {
      grid-template-columns: 1fr auto;
      grid-template-areas:
        'name link'
        'close link';

      &:first-of-type {
        border-top: 1px solid #e5e7eb;
      }
    }

    .store-name {
      grid-area: name;
      font-weight: 600;
    }

    .store-close-date {
      grid-area: close;
      font-size: 0.875rem;
    }

    .store-link {
      grid-area: link;
    }
  }

  @media (max-width: 375px) {
    .item {
      font-size: 0.875rem;
    }

    .store-close-date {
      font-size: 0.6875rem;
    }
  }
`;

export default function Stores({ stores }: Props) {
  return (
    <Layout>
      <StoresStyles>
        <div className="wrapper">
          <h2>Current Stores</h2>
          <div className="grid">
            <div className="header">
              <span>Store Name</span>
              <span>Close Date</span>
            </div>
            {stores.map(s => (
              <div key={s._id}>
                <div className="item">
                  <span className="store-name">{s.name}</span>
                  <span className="store-close-date">
                    {s.closeDate
                      ? `${format(
                          new Date(s.closeDate),
                          'LLL. do, yyyy'
                        )} at midnight (CT)`
                      : 'Permanently Open'}
                  </span>
                  <Link href={`/store/${s._id}`}>
                    <a className="store-link">
                      Visit store
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </StoresStyles>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { db } = await connectToDb();
  const stores: Store[] = await store.getStores(db);
  const activeStores = stores.filter(s => {
    const now = new Date();
    const isActive = !s.closeDate ? true : new Date(s.closeDate) > now;
    return isActive;
  });

  return { props: { stores: activeStores } };
};
