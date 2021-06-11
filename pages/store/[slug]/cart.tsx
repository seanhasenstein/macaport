import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import { useCart } from '../../../hooks/useCart';
import useHasMounted from '../../../hooks/useHasMounted';
import StoreLayout from '../../../components/store/StoreLayout';
import styled from 'styled-components';
import CartItem from '../../../components/store/CartItem';
import OrderTotals from '../../../components/store/OrderTotals';
import { CartItem as CartItemInterface, Store } from '../../../interfaces';
import Button from '../../../components/store/Button';
import { stores } from '../../../data';

const CartStyles = styled.div`
  padding: 0 1.5rem;

  .wrapper {
    margin: 4rem auto;
    max-width: 70rem;
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
    grid-template-columns: 1fr 20.5rem;
    gap: 0 6rem;
  }

  .items {
    max-width: 42rem;
    width: 100%;
  }

  .order-summary {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .inner {
      width: 100%;
      display: grid;
      gap: 1rem 0;
    }

    h3 {
      margin: 0 0 1.5rem;
      font-size: 1rem;
      font-weight: 600;
    }
  }

  .link-btn {
    margin: 1.5rem 0 0;
    padding: 0.75rem 1.5rem;
    background-color: #3f6ed4;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    text-align: center;
    border-radius: 0.375rem;
    border: 2px solid transparent;
    cursor: pointer;
  }

  .link-btn:hover {
    background-color: #3863be;
    border-color: #3f6ed4;
  }

  .link-btn:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(65, 141, 203, 0.3);
    border-color: #2f62d0;
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
      align-items: center;
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
                <div className="order-summary">
                  <div className="inner">
                    <h3>Order Summary</h3>
                    <OrderTotals
                      subtotal={cartSubtotal}
                      transactionFee={transactionFee}
                      total={cartTotal}
                    />
                    <Button
                      as="a"
                      color="black"
                      href={`/store/${store.slug}/checkout`}
                    >
                      Checkout
                    </Button>
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
