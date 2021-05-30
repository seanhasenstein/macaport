import React from 'react';
import Link from 'next/link';
import { useCart } from '../../hooks/useCart';
import useHasMounted from '../../hooks/useHasMounted';
import Layout from '../../components/demo-store/Layout';
import styled from 'styled-components';
import { formatToMoney } from '../../utils';
import CartItem from '../../components/demo-store/CartItem';
import OrderTotals from '../../components/demo-store/OrderTotals';
import { CartItem as CartItemInterface } from '../../interfaces';
import Button from '../../components/demo-store/Button';

const CartStyles = styled.div`
  margin: 3rem 0 0;
  padding: 0 1.5rem;

  h2 {
    margin: 0;
    font-size: 1.5rem;
    text-align: center;
  }

  .order-details {
    margin: 0.5rem 0 3rem;
    font-size: 1rem;
    text-align: center;
    color: #6e788c;
  }

  .items {
    margin: 0 auto;
    padding: 0 2rem;
    max-width: 56.25rem;
    width: 100%;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .order-summary {
    margin: 3rem auto;
    max-width: 900px;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .inner {
      max-width: 20rem;
      width: 100%;
      display: grid;
      grid-template-rows: auto auto auto;
      gap: 1.25rem 0;
    }

    h3 {
      margin: 0;
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

  @media (max-width: 800px) {
    .items {
      padding: 0;
      background-color: transparent;
      box-shadow: none;
    }

    .order-summary {
      max-width: 100%;
      align-items: center;
    }

    .empty-cart {
      text-align: center;
    }
  }
`;

export default function Cart() {
  const hasMounted = useHasMounted();
  const {
    items,
    totalItems,
    cartSubtotal,
    transactionFee,
    cartTotal,
    cartIsEmpty,
  } = useCart();

  return (
    <Layout title="Cart | Track &amp; Field Apparel Order">
      <CartStyles>
        <h2>Your Cart</h2>
        {hasMounted ? (
          <>
            <div className="order-details">
              {totalItems} Item
              {totalItems > 1 ? 's' : totalItems === 0 ? 's' : null} |{' '}
              {formatToMoney(cartSubtotal)}
            </div>
            <div className="items">
              {cartIsEmpty ? (
                <div className="empty-cart">
                  Your cart is empty.{' '}
                  <Link href="/demo-store">Go to store home</Link>.
                </div>
              ) : (
                items.map((item: CartItemInterface) => (
                  <CartItem key={item.id} item={item} />
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
                <Button as="a" color="black" href="/demo-store/checkout">
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
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  Checkout
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </CartStyles>
    </Layout>
  );
}
