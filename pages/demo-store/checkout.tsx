import React from 'react';
import styled from 'styled-components';
import { useCart } from '../../hooks/useCart';
import useHasMounted from '../../hooks/useHasMounted';
import Layout from '../../components/Layout';
import CheckoutForm from '../../components/demo-store/CheckoutForm';
import CheckoutOrderItem from '../../components/demo-store/CheckoutOrderItem';
import OrderTotals from '../../components/demo-store/OrderTotals';
import { CartItem } from '../../interfaces';

const CheckoutStyles = styled.div`
  margin: 3rem auto;
  padding: 0 1.5rem;
  max-width: 65rem;
  width: 100%;

  h2 {
    margin: 0 0 2.5rem;
    font-size: 1.5rem;
    text-align: center;
  }

  .row {
    display: grid;
    grid-template-columns: minmax(32rem, 1fr) minmax(22rem, 24rem);
    background-color: #fff;
    border-radius: 0.5rem;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .main {
    margin: 2rem 0;
    border-right: 1px solid #e5e7eb;
  }

  .order-details-btn {
    display: none;
  }

  .order {
    margin: 3rem auto;
    max-width: 18rem;

    &.open,
    &.closed {
      display: block;
    }

    h3 {
      margin: 0 0 1.25rem;
      font-size: 1rem;
      font-weight: 600;
    }

    .summary {
      margin: 1.5rem 0 0;
    }
  }

  @media (max-width: 930px) {
    .row {
      padding: 0;
      display: flex;
      flex-direction: column-reverse;
      background-color: transparent;
      box-shadow: none;
    }

    .main {
      padding: 0 1.25rem;
      border-right: none;
      background-color: #fcfcfd;
      border-radius: 0.5rem;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    .order {
      margin: 0 auto;
      padding: 1rem 1.25rem 1.75rem;
      max-width: unset;
      background-color: #fcfcfd;
      border-radius: 0 0 0.5rem 0.5rem;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

      &.closed {
        display: none;
      }

      h3 {
        display: none;
      }
    }

    .order-details-btn {
      position: relative;
      margin: 0 auto;
      padding: 0.75rem 1.25rem;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background-color: #3a3f4a;
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      font-weight: 600;
      border-radius: 0.375rem;
      border: 2px solid transparent;
      cursor: pointer;
      z-index: 10;

      svg {
        height: 1.125rem;
        width: 1.125rem;

        &.flipped {
          transform: rotate(180deg);
        }
      }

      &.open {
        border-radius: 0.5rem 0.5rem 0 0;
      }

      &:hover {
        background-color: #31363f;
        border-color: #484a52;
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 4px rgba(149, 152, 162, 0.35);
        border-color: #303137;
      }
    }
  }
`;

export default function Checkout() {
  const hasMounted = useHasMounted();
  const [isOpen, setIsOpen] = React.useState(false);
  const { items, totalItems, cartSubtotal, transactionFee, cartTotal } =
    useCart();

  return (
    <Layout title="Checkout | Track & Field Apparel Order">
      <CheckoutStyles>
        <h2>Checkout</h2>
        <div className="row">
          <div className="main">
            <CheckoutForm />
          </div>
          {hasMounted ? (
            <div className="sidebar">
              <button
                className={`order-details-btn ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
              >
                Order Details ({totalItems} Item
                {totalItems > 1 ? 's' : totalItems === 0 ? 's' : null})
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className={isOpen ? 'flipped' : ''}
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <div className={`order ${isOpen ? 'open' : 'closed'}`}>
                <h3>
                  Order Details ({totalItems} Item
                  {totalItems > 1 ? 's' : totalItems === 0 ? 's' : null})
                </h3>
                <div className="order-items">
                  {items.map((item: CartItem) => (
                    <CheckoutOrderItem key={item.id} item={item} />
                  ))}
                </div>
                <div className="summary">
                  <h3>Order Summary</h3>
                  <OrderTotals
                    subtotal={cartSubtotal}
                    transactionFee={transactionFee}
                    total={cartTotal}
                  />
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CheckoutStyles>
    </Layout>
  );
}
