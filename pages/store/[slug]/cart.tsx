import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useCart } from '../../../hooks/useCart';
import useHasMounted from '../../../hooks/useHasMounted';
import StoreLayout from '../../../components/store/StoreLayout';
import styled from 'styled-components';
import CartItem from '../../../components/store/CartItem';
import { CartItem as CartItemInterface, Store } from '../../../interfaces';
import { formatToMoney } from '../../../utils';
import LinkButton from '../../../components/store/Link';
import { stores } from '../../../data';

const CartStyles = styled.div`
  padding: 0 1.5rem;

  .wrapper {
    margin: 4rem auto;
    max-width: 72rem;
    width: 100%;
  }

  h2 {
    margin: 0 0 1.5rem;
    font-size: 1.5rem;
  }

  .order-details {
    margin: 0.5rem 0 1.5rem;
    font-size: 1rem;
    color: #6e788c;
    display: none;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 25rem;
    gap: 0 6rem;
  }

  .items {
    max-width: 42rem;
    width: 100%;
  }

  .order-summary {
    padding: 1.875rem 2.5rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    background-color: #fff;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    h3 {
      margin: 0 0 1rem;
      font-size: 1.125rem;
      font-weight: 600;
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
        .key,
        .value {
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

  .empty-cart {
    padding: 1.5rem 0;

    a {
      color: #3f6ed4;
      text-decoration: underline;

      &:hover {
        color: #2f62d0;
      }
    }
  }

  @media (max-width: 1000px) {
    h2 {
      margin: 0;
      text-align: center;
    }

    .order-details {
      display: block;
      text-align: center;
    }

    .grid {
      margin: 0 auto;
      max-width: 700px;
      grid-template-columns: 1fr;
      grid-template-rows: auto auto;
    }

    .items {
      max-width: unset;
      width: 100%;
    }

    .order-summary {
      margin: 3rem 0 0;
      max-width: 100%;
    }

    .empty-cart {
      text-align: center;
    }
  }
`;

type Props = {
  store: Store;
  error: string;
};

export default function Cart({ store, error }: Props) {
  const hasMounted = useHasMounted();
  const {
    items,
    totalItems,
    cartSubtotal,
    transactionFee,
    cartTotal,
    cartIsEmpty,
  } = useCart();

  if (error) {
    // todo
  }

  return (
    <StoreLayout
      title={`Cart | ${store.name} | Macaport`}
      storeSlug={store.slug}
    >
      <CartStyles>
        <div className="wrapper">
          <h2>Your Cart</h2>
          {hasMounted ? (
            <>
              <div className="order-details">
                ({totalItems} Item
                {totalItems > 1 ? 's' : totalItems === 0 ? 's' : null})
              </div>
              <div className="grid">
                <div className="items">
                  {cartIsEmpty ? (
                    <div className="empty-cart">
                      Your cart is empty.{' '}
                      <Link href={`/store/${store.slug}`}>
                        Back to store home
                      </Link>
                      .
                    </div>
                  ) : (
                    items.map((item: CartItemInterface) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        storeName={store.name}
                      />
                    ))
                  )}
                </div>
                <div>
                  <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="item">
                      <div className="key">Subtotal</div>
                      <div className="value">
                        {formatToMoney(cartSubtotal, true)}
                      </div>
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
                      <div className="value">
                        {formatToMoney(cartTotal, true)}
                      </div>
                    </div>
                    <LinkButton
                      href={`/store/${store.slug}/checkout`}
                      label="Checkout"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </CartStyles>
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
