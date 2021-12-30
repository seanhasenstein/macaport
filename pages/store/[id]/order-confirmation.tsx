import React from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import { format } from 'date-fns';
import { connectToDb, order } from '../../../db';
import { Order } from '../../../interfaces';
import { formatPhoneNumber, formatToMoney } from '../../../utils';
import { useCart } from '../../../hooks/useCart';
import NoNavLayout from '../../../components/store/NoNavLayout';

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    if (context.query === undefined || context.query.id === undefined) {
      throw new Error('You must provide a store id.');
    }
    if (context.query === undefined || context.query.orderId === undefined) {
      throw new Error('You must provide an order id.');
    }

    const storeId = Array.isArray(context.query.id)
      ? context.query.id[0]
      : context.query.id;

    const orderId = Array.isArray(context.query.orderId)
      ? context.query.orderId[0]
      : context.query.orderId;

    const { db } = await connectToDb();
    const result = await order.getOrderFromStore(db, storeId, orderId);

    return {
      props: {
        order: result.order,
        groupRequired: result.groupRequired,
        groupTerm: result.groupTerm,
      },
    };
  } catch (error) {
    return {
      props: {
        error,
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

export default function Temp({
  order,
  groupRequired,
  groupTerm,
  error,
}: Props) {
  const router = useRouter();
  const { emptyCart } = useCart();

  React.useEffect(() => {
    if (router.query.emptyCart) {
      emptyCart();
    }
  }, [emptyCart, router.query.emptyCart]);

  return (
    <NoNavLayout title="Order Confirmation">
      <OrderConfirmationStyles>
        <div className="order-confirmation-wrapper">
          {error && (
            <div className="error">
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <h3>An error has occurred!</h3>
              <p>
                {error} Please contact us with any questions at{' '}
                <a
                  href={`mailto:support@macaport.com?subject=Order Inquiry [Order #${order.orderId}]`}
                >
                  support@macaport.com
                </a>
                .
              </p>
            </div>
          )}
          {order && (
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
                    <h5>Payment Successful</h5>
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
                      <span>Order Number:</span>#{order.orderId}
                    </div>
                    <div className="detail-item">
                      <span>Transaction ID:</span>
                      {order.stripeId}
                    </div>
                    <div className="detail-item">
                      <span>Order Date:</span>
                      {format(new Date(order.createdAt!), 'LLL dd, yyyy')}
                    </div>
                    <div className="detail-item">
                      <span>Store:</span>
                      {order.store.name}
                    </div>
                    {groupRequired && (
                      <div className="detail-item">
                        <span className="capitalize">{groupTerm}:</span>
                        {order.group}
                      </div>
                    )}
                  </div>
                  <div className="section order-info">
                    <h3>Customer Information</h3>
                    <p>
                      {order.customer.firstName} {order.customer.lastName}
                    </p>
                    <p>{order.customer.email}</p>
                    <p>{formatPhoneNumber(order.customer.phone)}</p>
                  </div>

                  {order.shippingMethod === 'Direct' && (
                    <div className="section shipping-details">
                      <h3>Shipping Address</h3>
                      <p>
                        {order.shippingMethod === 'Direct'
                          ? `${order.customer.firstName} ${order.customer.lastName}`
                          : order.shippingAddress.name}
                        <br />
                        {order.shippingAddress.street}{' '}
                        {order.shippingAddress.street2}
                        <br />
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state}{' '}
                        {order.shippingAddress.zipcode}
                      </p>
                    </div>
                  )}
                  {order.shippingMethod === 'Primary' && (
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
                    {order.items.map(item => (
                      <div key={item.sku.id} className="order-item">
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
                            {item.customName && (
                              <div className="order-item-detail">
                                Name:{' '}
                                <span className="value">{item.customName}</span>
                              </div>
                            )}
                            {item.customNumber && (
                              <div className="order-item-detail">
                                Number:{' '}
                                <span className="value">
                                  {item.customNumber}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-summary">
                    <h3>Order Summary</h3>
                    <div className="order-summary-item">
                      <div className="label">Subtotal</div>
                      <div className="value">
                        {formatToMoney(order.summary.subtotal, true)}
                      </div>
                    </div>
                    <div className="order-summary-item">
                      <div className="label">Sales Tax</div>
                      <div className="value">
                        {formatToMoney(order.summary.salesTax, true)}
                      </div>
                    </div>
                    <div className="order-summary-item">
                      <div className="label">Shipping</div>
                      <div className="value">
                        {formatToMoney(order.summary.shipping, true)}
                      </div>
                    </div>
                    <div className="order-summary-item total">
                      <div>Order Total</div>
                      <div className="value">
                        {formatToMoney(order.summary.total, true)}
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
    max-width: 78rem;
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
    gap: 6rem;
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
    color: #3730a3;
    text-transform: uppercase;
    letter-spacing: 0.075em;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #4b5563;
    line-height: 1.5;

    a {
      color: #3730a3;
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
      margin: 0 0 0.625rem;
    }

    p {
      margin: 0 0 0.125rem;
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.5;

      &:last-of-type {
        margin: 0;
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
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .order-item-detail {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    color: #6b7280;

    .value {
      margin: 0 0 0 0.25rem;
      color: #1f2937;
    }
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
  }

  @media (max-width: 500px) {
    .main-content {
      gap: 1.5rem;
    }

    .section {
      margin: 0 0 2rem;

      &:first-of-type {
        margin: 0 0 3.5rem;
      }
    }

    .order-details {
      .detail-item {
        margin: 0 0 2rem;

        span {
          margin: 0 0 0.5rem;
          display: block;
          width: 100%;
        }
      }
    }

    .order-info,
    .shipping-details {
      h3 {
        margin: 0 0 0.5rem;
        font-size: 1rem;
        font-weight: 600;
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

  /* TODO */

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
