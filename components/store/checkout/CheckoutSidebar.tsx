import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { formatToMoney } from 'utils';
import useHasMounted from 'hooks/useHasMounted';
import { PricedCart } from 'hooks/usePricedCart';
import CheckoutItem from './CheckoutItem';

type Props = {
  priced: PricedCart;
};

// Renders whatever the pricing pipeline produced. It has no idea what kinds
// of adjustment exist: a credit, a discount, a free shirt and a waived small
// balance are all a label and an amount.
export default function CheckoutSidebar({ priced }: Props) {
  const router = useRouter();
  const hasMounted = useHasMounted();

  return (
    <CheckoutSidebarStyles>
      {hasMounted && (
        <div>
          <div className="sidebar">
            <div className="products">
              <h3>Order Items</h3>
              {priced.items.length < 1 && (
                <div className="empty-order">
                  Your order is empty.{' '}
                  <Link
                    href={`/store/${router.query.id}${
                      router.pathname.split('/').includes('demo') ? '/demo' : ''
                    }`}
                  >
                    <a>Continue shopping</a>
                  </Link>
                  .
                </div>
              )}
              <div className="items">
                {priced.items.map(item => (
                  <CheckoutItem key={item.id} item={item} />
                ))}
              </div>
            </div>
            <div className="order-summary">
              <h3>Order Summary</h3>
              <div className="item">
                <div className="key">Subtotal</div>
                <div className="value">
                  {formatToMoney(priced.subtotal, true)}
                </div>
              </div>
              {priced.adjustments.map((adjustment, index) => (
                <div className="item" key={`${adjustment.kind}-${index}`}>
                  <div className="key">{adjustment.label}</div>
                  <div className="value">
                    -{formatToMoney(-adjustment.amount, true)}
                  </div>
                </div>
              ))}
              <div className="item">
                <div className="key">Sales Tax</div>
                <div className="value">
                  {formatToMoney(priced.salesTax, true)}
                </div>
              </div>
              <div className="item">
                <div className="key">Shipping</div>
                <div className="value">
                  {formatToMoney(priced.shipping, true)}
                </div>
              </div>
              <div className="item total">
                <div className="key">Order Total</div>
                <div className="value">{formatToMoney(priced.total, true)}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </CheckoutSidebarStyles>
  );
}

const CheckoutSidebarStyles = styled.div`
  .sidebar {
    padding: 2rem 2.5rem;
    background-color: #fff;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    h3 {
      margin: 0 0 1.75rem;
      font-size: 1.125rem;
      color: #36383e;
      font-weight: 600;
    }
  }

  .empty-order {
    font-size: 0.9375rem;
    color: #6b7280;
    line-height: 1.5;

    a {
      display: inline-flex;
      align-items: center;
      color: #2837b9;
      text-decoration: underline;

      &:hover {
        color: #1629cb;
      }
    }
  }

  .order-summary {
    padding: 3rem 0 0;

    h3 {
      margin: 0 0 1rem;
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
          font-weight: 600;
        }

        .value {
          color: #059669;
        }
      }
    }
  }

  @media (max-width: 500px) {
    .sidebar {
      padding: 1.75rem 1.5rem;
    }
  }
`;
