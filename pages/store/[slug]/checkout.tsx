import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useCart } from '../../../hooks/useCart';
import { Store } from '../../../interfaces';
import { formatToMoney } from '../../../utils';
import StoreLayout from '../../../components/store/StoreLayout';
import CheckoutItem from '../../../components/store/CheckoutItem';
import CheckoutForm from '../../../components/store/CheckoutForm';
import { stores } from '../../../data';

const CheckoutStyles = styled.div`
  padding: 0 1.5rem;

  h2 {
    margin: 4rem auto 0;
    max-width: 72rem;
    font-size: 1.625rem;
  }

  .wrapper {
    margin: 0 auto;
    max-width: 72rem;
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 32rem) 32rem;
    grid-template-rows: auto auto;
    justify-content: space-between;
    gap: 0 3rem;
  }

  .sidebar {
    padding: 2rem 2.5rem;
    background-color: #fff;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    h3 {
      margin: 0 0 1.25rem;
      font-size: 1.125rem;
      color: #36383e;
    }
  }

  .order-summary {
    padding: 3rem 0 0;

    .item {
      padding: 1.125rem 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e5e7eb;

      &:last-of-type {
        border: none;
      }

      .key,
      .value {
        font-size: 0.9375rem;
        font-weight: 500;
      }

      .key {
        color: #6b7280;
      }

      .value {
        color: #111827;
      }

      &.total {
        .key, .value {
          color: #374151;
          font-size: 1rem;
          font-weight: 700;
        }

        .value {
          color: #059669;
        }
      }
    }
  }

  @media (max-width: 1024px) {
    h2 {
      margin: 3rem 0;
      font-size: 1.5rem;
      text-align: center;
    }

    .wrapper {
      max-width: 38rem;
      display: flex;
      flex-direction: column-reverse;
    }
  }

  @media (max-width: 500px) {
    .sidebar {
      padding: 1.75rem 1.5rem;
    }
  }
`;

type Props = {
  store: Store;
};

export default function CheckoutV2({ store }: Props) {
  const { items, totalItems, cartSubtotal, transactionFee, cartTotal } =
    useCart();

  return (
    <StoreLayout
      title={`Checkout | ${store.name} | Macaport`}
      storeSlug={store.slug}
    >
      <CheckoutStyles>
        <h2>Order Checkout</h2>
        <div className="wrapper">
          <CheckoutForm />
          <div>
            <div className="sidebar">
              <div className="products">
                <h3>Your Products</h3>
                <div className="items">
                  {items.map(item => (
                    <CheckoutItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
              <div className="order-summary">
                <h3>Order Summary</h3>
                <div className="item">
                  <div className="key">Subtotal</div>
                  <div className="value">{formatToMoney(cartSubtotal, true)}</div>
                </div>
                <div className="item">
                  <div className="key">Estimated Shipping</div>
                  <div className="value">{formatToMoney(0, true)}</div>
                </div>
                <div className="item">
                  <div className="key">Estimated Sales Tax</div>
                  <div className="value">
                    {formatToMoney(transactionFee, true)}
                  </div>
                </div>
                <div className="item total">
                  <div className="key">Order Total</div>
                  <div className="value">{formatToMoney(cartTotal, true)}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CheckoutStyles>
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
