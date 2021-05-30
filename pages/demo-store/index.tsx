import Link from 'next/link';
import styled from 'styled-components';
import Layout from '../../components/demo-store/Layout';
import { products } from '../../data';
import { Item } from '../../interfaces';
import { formatToMoney } from '../../utils';

const Store = styled.div`
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

  .item {
    padding: 0 1rem 0.875rem 1rem;
    position: relative;
    background-color: #f4f4f5;
    border-radius: 0.25rem;

    &:hover .img-wrapper img {
      transform: scale(1.04);
    }

    .img-wrapper {
      padding: 2rem 1rem;
      display: flex;
      justify-content: center;
      border-bottom: 1px solid #e5e7eb;
      border-radius: 0.25rem 0.25rem 0 0;

      img {
        max-width: 11rem;
        width: 100%;
        height: 100%;
        transition: transform 150ms ease-in-out;
      }
    }

    .details {
      padding: 0.875rem 0 2.75rem;
    }

    .primary,
    .secondary {
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.5;
    }

    .primary {
      margin: 0 0 0.125rem;
      color: #36383e;
      line-height: 1.25;
    }

    .secondary {
      margin: 0;
      color: #9e9eac;
    }

    .price {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
      color: #36383e;
      position: absolute;
      bottom: 0.75rem;
      left: 1rem;
    }
  }

  .colors {
    display: flex;
    position: absolute;
    bottom: 0.875rem;
    right: 1rem;
  }

  @media (max-width: 800px) {
    .items {
      padding: 0;
      grid-template-columns: 1fr 1fr;

      .item:nth-of-type(odd) {
        border-radius: 0 0.25rem 0.25rem 0;
      }

      .item:nth-of-type(even) {
        border-radius: 0.25rem 0 0 0.25rem;
      }
    }
  }
`;

const ColorStyles = styled.div`
  margin: 0 0 0 0.375rem;
  background-color: ${(props: { hex: string }) => props.hex};
  height: 0.875rem;
  width: 0.875rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  border-radius: 9999px;
`;

function Color(props: { hex: string; label: string }) {
  return (
    <ColorStyles {...props} title={props.label}>
      <span className="sr-only">{props.label}</span>
    </ColorStyles>
  );
}

export default function Home() {
  return (
    <Layout>
      <Store>
        <h2>Macaport Demo Apparel Store</h2>
        <p>
          This store is for demo and testing purposes only. Use the test card
          4242 4242 4242 4242 to simulate a transaction.
        </p>
        <div className="items">
          {products.map((p: Item) => (
            <Link key={p.id} href={`/demo-store/product/${p.id}`}>
              <a className="item">
                <div className="img-wrapper">
                  <img src={p.image} alt={p.name} />
                </div>
                <div className="details">
                  <h3 className="primary">{p.name}</h3>
                  <h4 className="secondary">{p.tag}</h4>
                  <h4 className="price">{formatToMoney(p.price)}</h4>
                  <div className="colors">
                    {p.colors.map(c => (
                      <Color key={c.id} label={c.label} hex={c.hex} />
                    ))}
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </Store>
    </Layout>
  );
}
