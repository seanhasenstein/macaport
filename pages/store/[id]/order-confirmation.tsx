import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { connectToDb, order } from '../../../db';
import { Order } from '../../../interfaces';
import {
  formatPhoneNumber,
  formatToMoney,
  getUrlParameter,
} from '../../../utils';
import { useCart } from '../../../hooks/useCart';
import NoNavLayout from '../../../components/store/layouts/NoNavLayout';
import OrderConfirmationPageError from 'components/store/errors/OrderConfirmationPageError';

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    const storeId = getUrlParameter(context.query.id);

    if (!storeId) {
      return {
        props: {
          error: 'A store id is required',
        },
      };
    }

    const orderId = getUrlParameter(context.query.orderId);

    if (!orderId) {
      return {
        props: {
          error: 'An order id is required',
        },
      };
    }

    const db = await connectToDb();
    const result = await order.getOrderFromStore(db, storeId, orderId);

    if (!result) {
      return {
        props: {
          error: 'Invalid credentials provided.',
        },
      };
    }

    return {
      props: {
        order: result.order,
        groupRequired: result.groupRequired,
        groupTerm: result.groupTerm,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        error: 'Something went wrong while looking for your order.',
      },
    };
  }
};

type Props = {
  order: Order;
  groupRequired: boolean;
  groupTerm: string;
  error?: string;
};

export default function OrderConfirmation(props: Props) {
  const router = useRouter();
  const { emptyCart } = useCart();

  React.useEffect(() => {
    if (router.query.emptyCart) {
      emptyCart();
    }
  }, [emptyCart, router.query.emptyCart]);

  if (props.error) {
    return <OrderConfirmationPageError />;
  }

  const headerCopy =
    props.order.teacherAppreciation && props.order.summary.total === 0
      ? 'Order'
      : 'Payment';

  const isSheboyganLutheranStaffStore =
    !!props.order.sheboyganLutheranStaffDiscount?.id;
  const sheboyganLutheranStaffEmail =
    props.order.sheboyganLutheranStaffDiscount?.email;
  const sheboyganLutheranStaffDiscount =
    props.order.sheboyganLutheranStaffDiscount?.discount;
  const hasSheboyganLutheranStaffDiscount =
    !!isSheboyganLutheranStaffStore &&
    !!sheboyganLutheranStaffEmail &&
    !!sheboyganLutheranStaffDiscount;

  const isTeacherAppreciationStore = !!props.order.teacherAppreciation?.id;
  const teacherAppreciationEmail = props.order.teacherAppreciation?.email;
  const orderHasFreeItem = props.order.items.some(
    item => item.itemTotal === 0 && item.quantity === 1
  );
  const eligibleForTeacherAppreciation =
    isTeacherAppreciationStore && teacherAppreciationEmail;

  return (
    <NoNavLayout
      title={`${props.order.store.name} Order #${props.order.orderId}`}
    >
      <OrderConfirmationStyles>
        <div className="order-confirmation-wrapper">
          {props.order && (
            <>
              <div className="header print-only" aria-hidden="true">
                <div className="logo">
                  <Link href="/">
                    <a>
                      <img
                        src="/images/logo.png"
                        alt="Macaport text in front of mountains."
                      />
                    </a>
                  </Link>
                </div>
                <div className="print-only">
                  <div className="support-link">support@macaport.com</div>
                  <div className="support-link">www.macaport.com</div>
                </div>
              </div>
              <div className="main-content">
                <div className="order-information">
                  <div className="section ">
                    <h5>{headerCopy} Successful</h5>
                    <h2>Thank you for your order!</h2>
                    <p>
                      We have received your order and are currently processing
                      it. You should receive a confirmation email shortly. If
                      you have any questions you can reach us at{' '}
                      <a href="mailto:support@macaport.com">
                        support@macaport.com
                      </a>
                      .
                    </p>
                  </div>
                  <div className="section order-details">
                    <div className="detail-item">
                      <span>Order Number:</span>#{props.order.orderId}
                    </div>
                    {props.order.stripeId ? (
                      <div className="detail-item">
                        <span>Transaction ID:</span>
                        {props.order.stripeId}
                      </div>
                    ) : null}
                    <div className="detail-item">
                      <span>Order Date:</span>
                      {format(
                        new Date(props.order.createdAt!),
                        "MMM. dd, yyyy 'at' h:mmaa"
                      )}
                    </div>
                    <div className="detail-item">
                      <span>Store:</span>
                      {props.order.store.name}
                    </div>
                    {props.groupRequired && (
                      <div className="detail-item">
                        <span className="capitalize">{props.groupTerm}:</span>
                        {props.order.group}
                      </div>
                    )}
                  </div>
                  <div className="section order-info">
                    <h3>Customer Information</h3>
                    <p>
                      {props.order.customer.firstName}{' '}
                      {props.order.customer.lastName}
                    </p>
                    <p>{props.order.customer.email}</p>
                    <p>{formatPhoneNumber(props.order.customer.phone)}</p>
                  </div>

                  {props.order.note ? (
                    <div className="section">
                      <h3>Order Notes</h3>
                      <p>{props.order.note}</p>
                    </div>
                  ) : null}

                  {props.order.shippingMethod === 'Direct' && (
                    <div className="section shipping-details">
                      <h3>Shipping Address</h3>
                      <p>
                        {props.order.shippingMethod === 'Direct'
                          ? `${props.order.customer.firstName} ${props.order.customer.lastName}`
                          : props.order.shippingAddress.name}
                        <br />
                        {props.order.shippingAddress.street}{' '}
                        {props.order.shippingAddress.street2}
                        <br />
                        {props.order.shippingAddress.city},{' '}
                        {props.order.shippingAddress.state}{' '}
                        {props.order.shippingAddress.zipcode}
                      </p>
                    </div>
                  )}

                  {props.order.shippingMethod === 'Store Pickup' && (
                    <div className="section shipping-details">
                      <h3>Order Pickup</h3>
                      <p>
                        You selected to pick up your order at our store. We'll
                        let you know when your order is ready. Our address is:
                      </p>
                      <p className="store-address">
                        3080 Fredrick Farm Ln.
                        <br />
                        New London, WI 54961
                      </p>
                    </div>
                  )}

                  {props.order.shippingMethod === 'Primary' && (
                    <div className="section shipping-details">
                      <h3>Order Pickup</h3>
                      <p>
                        Your order will be shipped to the organizer of this
                        store. Please contact them for pickup information.
                      </p>
                    </div>
                  )}
                </div>
                <div className="order-items">
                  <h3>Order Items</h3>
                  <div>
                    {props.order.items.map(item => {
                      const renderTeacherAppreciation =
                        eligibleForTeacherAppreciation &&
                        orderHasFreeItem &&
                        item.itemTotal === 0;

                      return (
                        <div key={item.id} className="order-item">
                          <div className="item-img">
                            <img
                              src={item.sku.color.primaryImage}
                              alt={`${item.sku.color.label} ${item.name}`}
                            />
                          </div>
                          <div className="order-item-column">
                            <div className="order-item-header">
                              <div className="order-item-name">{item.name}</div>
                              <div className="order-item-total">
                                {formatToMoney(item.itemTotal!)}
                              </div>
                            </div>
                            {renderTeacherAppreciation && (
                              <div className="teacher-appreciation">
                                <div>Free Staff Appreciation Item</div>
                                <div className="email">
                                  {teacherAppreciationEmail}
                                </div>
                              </div>
                            )}
                            <div className="order-item-details">
                              <div className="order-item-detail item-quantity">
                                Qty:{' '}
                                <span className="value">{item.quantity}</span>
                              </div>
                              <div className="order-item-detail item-color">
                                Color:{' '}
                                <span className="value">
                                  {item.sku.color.label}
                                </span>
                              </div>
                              <div className="order-item-detail item-size">
                                Size:{' '}
                                <span className="value">
                                  {item.sku.size.label}
                                </span>
                              </div>
                              {item.personalizationAddons.length > 0 ? (
                                <div className="personalization">
                                  <div className="addon-label">Addons:</div>
                                  <div className="addon-items">
                                    {item.personalizationAddons.map(addon => (
                                      <div
                                        key={addon.id}
                                        className="addon-item"
                                      >
                                        {addon.value}
                                        {addon.subItems.length > 0 ? (
                                          <>
                                            {addon.subItems.map(subItem => (
                                              <div
                                                key={subItem.id}
                                                className="subitem"
                                              >
                                                {subItem.value}
                                              </div>
                                            ))}
                                          </>
                                        ) : null}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="order-summary-item">
                      <div className="label">Subtotal</div>
                      <div className="value">
                        {formatToMoney(props.order.summary.subtotal, true)}
                      </div>
                    </div>
                    {/* SHEBOYGAN LUTHERAN STAFF DISCOUNT */}
                    {hasSheboyganLutheranStaffDiscount ? (
                      <div className="order-summary-item">
                        <div className="label">Sheboygan Lutheran Staff</div>
                        <div className="value">
                          -{formatToMoney(sheboyganLutheranStaffDiscount, true)}
                        </div>
                      </div>
                    ) : null}
                    {props.order.switchFitnessDiscount &&
                    props.order.summary.discount ? (
                      <div className="order-summary-item">
                        <div className="label">Switch Fitness Discount</div>
                        <div className="value">
                          -{formatToMoney(props.order.summary.discount, true)}
                        </div>
                      </div>
                    ) : null}
                    <div className="order-summary-item">
                      <div className="label">Sales Tax</div>
                      <div className="value">
                        {formatToMoney(props.order.summary.salesTax, true)}
                      </div>
                    </div>
                    <div className="order-summary-item">
                      <div className="label">Shipping</div>
                      <div className="value">
                        {formatToMoney(props.order.summary.shipping, true)}
                      </div>
                    </div>
                    <div className="order-summary-item total">
                      <div>Order Total</div>
                      <div className="value">
                        {formatToMoney(props.order.summary.total, true)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </OrderConfirmationStyles>
    </NoNavLayout>
  );
}

const OrderConfirmationStyles = styled.div`
  padding: 0 1.5rem;

  .order-confirmation-wrapper {
    margin: 0 auto;
    max-width: 72rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .print-only {
    display: none;
  }

  .main-content {
    padding: 4rem 0;
    display: grid;
    grid-template-columns: 1fr 1fr;
    justify-content: space-between;
    gap: 3rem;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    line-height: 1.35;
  }

  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  h5 {
    margin: 0 0 1rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #282eab;
    text-transform: uppercase;
    letter-spacing: 0.075em;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.5;

    a {
      color: #303eb1;
      text-decoration: underline;
    }
  }

  .section {
    margin: 0 0 4rem;
  }

  .order-information {
    padding: 0 3rem 0 0;
  }

  .order-details {
    .detail-item {
      margin: 0 0 0.625rem;
      font-size: 1rem;
      font-weight: 400;
      color: #4b5563;

      &:last-of-type {
        margin: 0;
      }

      span {
        display: inline-flex;
        width: 9rem;
        color: #111827;
        font-weight: 600;
      }
    }
  }

  .order-info,
  .shipping-details {
    h3 {
      margin: 0 0 0.5rem;
    }

    p {
      margin: 0 0 0.125rem;
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.5;

      &:last-of-type {
        margin: 0;
      }

      &.store-address {
        margin: 1.25rem 0 0;
      }
    }
  }

  .order-items {
    padding: 2rem 2.5rem 2.5rem;
    max-width: 40rem;
    width: 100%;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    h3 {
      margin: 0 0 1.75rem;
    }
  }

  .order-item {
    padding: 1.125rem 0;
    display: flex;
    gap: 1.5rem;
    border-bottom: 1px solid #e5e7eb;

    &:first-of-type {
      border-top: 1px solid #e5e7eb;
    }

    .teacher-appreciation {
      margin: 0.25rem 0 0;
      font-size: 0.875rem;
      color: #1f2937;
      font-weight: 500;
      display: grid;
      width: 100%;
      overflow-x: hidden;
      text-overflow: ellipsis;
      .email {
        margin: 0.125rem 0 0;
        font-size: 0.75rem;
        color: #6b7280;
        overflow-x: hidden;
        text-overflow: ellipsis;
      }
    }
  }

  .order-item-column {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .order-item-header {
    display: flex;
    justify-content: space-between;
  }

  .item-img {
    width: 5.5rem;

    img {
      padding: 0.5rem;
      width: 100%;
      background-color: #fff;
      border: 1px solid #e5e7eb;
      border-radius: 0.25rem;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .order-item-name,
  .order-item-total {
    font-size: 0.9375rem;
    font-weight: 600;
    color: #111827;
  }

  .order-item-detail {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #6b7280;

    .value {
      margin: 0 0 0 0.25rem;
      color: #111827;
    }
  }

  .personalization {
    margin: 0.25rem 0 0;
    display: flex;
    font-size: 0.875rem;
  }

  .addon-item {
    margin: 0.25rem 0 0;

    &:first-of-type {
      margin: 0;
    }
  }

  .subitem {
    margin: 0.25rem 0 0;
  }

  .addon-label {
    margin: 0 0.5rem 0 0;
    color: #6b7280;
  }

  .addon-item {
    color: #111827;
  }

  .order-summary {
    padding: 3rem 0 0;

    h3 {
      margin: 0 0 1.75rem;
    }
  }

  .order-summary-item {
    padding: 0 0 0.875rem;
    display: flex;
    justify-content: space-between;
    font-size: 1rem;

    .label {
      color: #4b5563;
    }

    .value {
      color: #111827;
    }
  }

  .total {
    margin: 0.125rem 0 0;
    padding: 1rem 0 0;
    font-weight: 600;
    color: #111827;
    border-top: 1px solid #e5e7eb;

    .value {
      color: #059669;
    }
  }

  .error {
    margin: 5rem auto 0;
    padding: 2.5rem 2rem 3rem;
    max-width: 40rem;
    width: 100%;
    text-align: center;
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.3125rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    svg {
      margin: 0 0 0.5rem;
      height: 1.75rem;
      width: 1.75rem;
      color: #f87171;
    }

    h3 {
      margin: 0.5rem 0 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    p {
      margin: 0;
      font-size: 1rem;
      color: #6e788c;
      line-height: 1.5;
    }

    a {
      color: #3b82f6;
      text-decoration: underline;

      &:hover {
        color: #2563eb;
      }
    }
  }

  .capitalize {
    text-transform: capitalize;
  }

  @media (max-width: 1024px) {
    .main-content {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .order-items {
      max-width: unset;
    }

    .section {
      margin: 0 0 3.5rem;
    }
  }

  @media (max-width: 500px) {
    .main-content {
      gap: 1.5rem;
    }

    .order-details {
      .detail-item {
        margin: 0 0 2.25rem;

        span {
          margin: 0 0 0.5rem;
          display: block;
          width: 100%;
        }
      }
    }

    .order-items {
      padding: 1rem 1rem 1.5rem;
    }

    .order-item {
      gap: 1rem;
    }

    .item-img {
      width: 4.5rem;
    }

    .order-item-header {
      gap: 1rem;
    }

    .order-item-name,
    .order-item-total {
      font-size: 0.875rem;
    }

    .order-item-name {
      margin: 0 0 0.25rem;
    }
  }

  @media print {
    background-color: transparent;

    @page {
      margin-top: 0;
      margin-bottom: 0;
    }

    @media (resolution: 300dpi) {
      .print-only {
        display: block;
      }

      p,
      .order-details .detail-item,
      .order-info p,
      .shipping-details p,
      .order-summary-item .label {
        color: #404040;
      }

      .order-confirmation-wrapper {
        display: block;
        background-color: transparent;
      }

      .header {
        margin: 0 auto;
        padding: 3.5rem 0 1rem;
        max-width: 78rem;
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #d4d4d4;
      }

      .logo img {
        width: 16rem;
      }

      .support-link {
        font-size: 1rem;
        color: #737373;
        text-align: right;

        &:first-of-type {
          margin: 0 0 0.25rem;
        }
      }

      .main-content {
        padding-top: 3rem;
        grid-template-columns: minmax(32rem, 36rem) minmax(30rem, 36rem);
        justify-content: space-between;
        gap: 0;
      }

      .order-information {
        padding: 0 4rem 0 0;
      }

      .order-items {
        padding-right: 0;
        padding-left: 2rem;
        border: none;
        box-shadow: none;
      }

      .order-item {
        padding: 1rem 0;
        gap: 1rem;
        border-color: #d4d4d4;

        &:first-of-type {
          border-color: #d4d4d4;
        }
      }

      .item-img {
        width: 2.5rem;

        img {
          padding: 0;
          background-color: transparent;
          border: none;
          box-shadow: none;
        }
      }

      .order-item-column {
        justify-content: center;
      }

      .order-item-details {
        display: flex;
        flex-wrap: wrap;
        gap: 0.125rem 2.5rem;
      }

      .total {
        border-color: #d4d4d4;
      }
    }
  }
`;
