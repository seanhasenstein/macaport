import { GetServerSideProps } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../components/Layout';
import { stores } from '../data';
import { Store } from '../interfaces';
import { formatDate } from '../utils';

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
    font-size: 1.75rem;
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

  .header {
    padding: 0 0 0.75rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.0375em;
    border-bottom: 1px solid #e5e7eb;
  }

  .item {
    padding: 0.75rem 0;
    border-bottom: 1px solid #e5e7eb;
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`;

export default function Stores({ stores }: Props) {
  return (
    <Layout>
      <StoresStyles>
        <div className="wrapper">
          <h2>Stores</h2>
          <p>
            {stores.length > 0
              ? 'The following stores are currently open and accepting orders.'
              : 'There are currently no stores open.'}
          </p>
          <div className="grid">
            <div className="header">
              <span>Store Name</span>
              <span>Close Date</span>
            </div>
            {stores.map(s => (
              <Link key={s.id} href={`/store/${s.slug}`}>
                <a>
                  <div className="item">
                    <span className="store-name">{s.name}</span>
                    <span className="store-close-date">
                      {`${formatDate(s.closeDate)} at midnight (CT)`}
                    </span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </StoresStyles>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const activeStores = stores.filter(s => {
    const now = new Date();
    const isActive = new Date(s.closeDate) > now;
    if (isActive) return s;
  });

  return { props: { stores: activeStores } };
};
