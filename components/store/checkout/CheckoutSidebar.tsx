import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { formatToMoney } from 'utils';
import { CartItem } from 'interfaces';
import useHasMounted from 'hooks/useHasMounted';
import CheckoutItem from './CheckoutItem';

type Props = {
  cartSubtotal: number;
  cartTotal: number;
  items: CartItem[];
  salesTax: number;
  cartShipping: number;
  isTeacherAppreciationStore?: boolean;
  teacherAppreciationEmail?: string;
  cartHasFreeItem?: boolean;
  eligibleForTeacherAppreciation?: boolean;
  applySwitchFitnessDiscount?: boolean;
  applySheboyganLutheranStaffDiscount?: boolean;
  onlyDirectShipping: boolean;
  shippingPrice: number;
  shippingFreeMinimum: number;
};

export default function CheckoutSidebar(props: Props) {
  const router = useRouter();
  const hasMounted = useHasMounted();

  // TODO: move this to the useCart logic (if possible)
  // if applySheboyganLutheranStaffDiscount is true, shipping is 0 (because staff orders are being shipped to the school)
  // if onlyDirectShipping is true and cartSubtotal is less than shippingFreeMinimum, show shippingPrice
  // if onlyDirectShipping is true and cartSubtotal is greater than or equal to shippingFreeMinimum the shipping is 0
  // if onlyDirectShipping is false, show cartShipping
  function getShippingCost() {
    if (props.applySheboyganLutheranStaffDiscount) {
      return 0;
    }
    if (props.onlyDirectShipping) {
      if (props.cartSubtotal < props.shippingFreeMinimum) {
        return props.shippingPrice;
      }
      return 0;
    }
    return props.cartShipping;
  }

  // TODO: move this to the useCart logic (if possible)
  // NOTE: this function is also used in CheckoutForm.tsx and should be kept in sync
  // need to add to cart total if onlyDirectShipping is true and cartSubtotal is less than shippingFreeMinimum and applySheboyganLutheranStaffDiscount is false
  function getOrderTotal() {
    if (
      props.onlyDirectShipping &&
      props.cartSubtotal < props.shippingFreeMinimum &&
      !props.applySheboyganLutheranStaffDiscount
    ) {
      return props.cartTotal + props.shippingPrice;
    }
    return props.cartTotal;
  }

  return (
    <CheckoutSidebarStyles>
      {hasMounted && (
        <div>
          <div className="sidebar">
            <div className="products">
              <h3>Order Items</h3>
              {props.items.length < 1 && (
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
                {props.items.map(item => (
                  <CheckoutItem
                    key={item.id}
                    item={item}
                    isTeacherAppreciationStore={
                      props.isTeacherAppreciationStore
                    }
                    teacherAppreciationEmail={props.teacherAppreciationEmail}
                    cartHasFreeItem={props.cartHasFreeItem}
                    eligibleForTeacherAppreciation={
                      props.eligibleForTeacherAppreciation
                    }
                  />
                ))}
              </div>
            </div>
            <div className="order-summary">
              <h3>Order Summary</h3>
              {/* SUBTOTAL */}
              <div className="item">
                <div className="key">Subtotal</div>
                <div className="value">
                  {formatToMoney(props.cartSubtotal, true)}
                </div>
              </div>
              {/* SWITCH FITNESS DISCOUNT */}
              {props.applySwitchFitnessDiscount ? (
                <div className="item">
                  <div className="key">Switch Fitness Promo</div>
                  <div className="value">-$25.00</div>
                </div>
              ) : null}
              {/* SHEBOYGAN LUTHERAN STAFF DISCOUNT */}
              {props.applySheboyganLutheranStaffDiscount ? (
                <div className="item">
                  <div className="key">Sheboygan Lutheran Staff</div>
                  <div className="value">-$75.00</div>
                </div>
              ) : null}
              {/* SALES TAX */}
              <div className="item">
                <div className="key">Sales Tax</div>
                <div className="value">
                  {formatToMoney(props.salesTax, true)}
                </div>
              </div>
              {/* SHIPPING */}
              <div className="item">
                <div className="key">Shipping</div>
                <div className="value">
                  {formatToMoney(getShippingCost(), true)}
                </div>
              </div>
              {/* ORDER TOTAL */}
              <div className="item total">
                <div className="key">Order Total</div>
                <div className="value">
                  {formatToMoney(getOrderTotal(), true)}
                </div>
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
