import React from 'react';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import { useCart } from '../../../hooks/useCart';
import { Store } from '../../../interfaces';
import { formatToMoney } from '../../../utils';
import StoreLayout from '../../../components/store/StoreLayout';
import CheckoutItem from '../../../components/store/CheckoutItem';
import { stores } from '../../../data';

const CheckoutStyles = styled.div`
  padding: 0 1.5rem;

  .wrapper {
    margin: 0 auto;
    padding: 4rem 0;
    max-width: 66rem;
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 28rem;
    grid-template-rows: auto auto;
    gap: 0 6rem;
  }

  h2 {
    margin: 0 0 4rem;
    grid-column: 1/-1;
    font-size: 1.75rem;
  }

  h3 {
    margin: 0 0 1.75rem;
    font-size: 1.125rem;
    color: #36383e;
  }

  .order-summary {
    margin: 3rem 0 0;

    .box {
      padding: 0.5rem 1.875rem 1.875rem;
      background-color: #fff;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

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
        .key {
          color: #374151;
        }

        .value {
          font-size: 1.0625rem;
          font-weight: 600;
          color: #059669;
        }
      }
    }

    button {
      margin: 0.25rem 0 0;
      padding: 0.625rem 0;
      width: 100%;
      font-size: 0.875rem;
      font-weight: 600;
      color: #fff;
      background-color: #0f6fba;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
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
        <div className="wrapper">
          <div>
            <h2>Checkout</h2>
          </div>
          <div>
            <div>
              <div className="products">
                <h3>Your Products</h3>
                <div className="items">
                  {items.map(item => (
                    <CheckoutItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            </div>
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="box">
                <div className="item">
                  <div className="key">Subtotal</div>
                  <div className="value">
                    {formatToMoney(cartSubtotal, true)}
                  </div>
                </div>
                <div className="item">
                  <div className="key">Shipping</div>
                  <div className="value">{formatToMoney(0, true)}</div>
                </div>
                <div className="item">
                  <div className="key">Sales Tax</div>
                  <div className="value">
                    {formatToMoney(transactionFee, true)}
                  </div>
                </div>
                <div className="item total">
                  <div className="key">Order Total</div>
                  <div className="value">{formatToMoney(cartTotal, true)}</div>
                </div>
                <button type="submit">Submit order</button>
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
