import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import styled, { createGlobalStyle } from 'styled-components';
import { format } from 'date-fns';
import { connectToDb, order } from '../../../db';
import { Order } from '../../../interfaces';
import { formatPhoneNumber, formatToMoney } from '../../../utils';

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
        order: result,
      },
    };
  } catch (error) {
    return {
      props: {
        error: error.message,
      },
    };
  }
};

type Props = {
  order: Order;
  error?: string;
};

export default function Temp({ order, error }: Props) {
  return (
    <>
      <GlobalStyles />
      <Head>
        <title>Order Confirmation</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <OrderConfirmationStyles>
        <div className="wrapper">
          <div className="header">
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
            {/* <div className="actions">
              <button
                type="button"
                className="print-button"
                onClick={() => window.print()}
              >
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
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print Receipt
              </button>
            </div> */}
          </div>
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
                <a href="mailto:support@macaport.com">support@macaport.com</a>.
              </p>
            </div>
          )}
          {order && (
            <div className="main-content">
              <>
                <div>
                  <div className="explanation">
                    <h5>Payment Successful</h5>
                    <h2>Thank you for your order!</h2>
                    <p>
                      We have your order and are currently processing it. You
                      should receive a confirmation email shortly. If you have
                      any questions feel free to reach us at{' '}
                      <a href="mailto:support@macaport.com">
                        support@macaport.com
                      </a>
                      .
                    </p>
                  </div>
                  <div className="order-metadata">
                    <div className="order-number">
                      <span>Order Number:</span>
                      {order.orderId}
                    </div>
                    <div className="transaction-id">
                      <span>Transaction ID:</span>
                      {order.stripeId}
                    </div>
                    <div className="order-date">
                      <span>Order Date:</span>
                      {format(new Date(order.createdAt!), 'LLL dd, yyyy')}
                    </div>
                    <div className="store-name">
                      <span>Store:</span>
                      {order.store.name}
                    </div>
                  </div>
                  <div className="order-info">
                    <div className="customer">
                      <h3>Customer Information</h3>
                      <div className="name">
                        {order.customer.firstName} {order.customer.lastName}
                      </div>
                      <div className="email">{order.customer.email}</div>
                      <div className="phone">
                        {formatPhoneNumber(order.customer.phone)}
                      </div>
                    </div>
                    <div className="shipping-details">
                      <h3>Shipping Address</h3>
                      <div className="shipping-address">
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
                      </div>
                    </div>
                  </div>
                </div>
                <div className="order">
                  <h3>Order Items</h3>
                  <div>
                    {order.items.map(item => (
                      <div key={item.sku.id} className="item">
                        <div className="item-img">
                          <img
                            src={item.sku.color.primaryImage}
                            alt={`${item.sku.color.label} ${item.name}`}
                          />
                        </div>
                        <div className="item-name">{item.name}</div>
                        <div className="item-quantity">
                          Qty: {item.quantity}
                        </div>
                        <div className="item-color">{item.sku.color.label}</div>
                        <div className="item-size">{item.sku.size.label}</div>
                        <div className="item-total">
                          {formatToMoney(item.itemTotal!)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="order-summary">
                    <div className="subtotal">
                      <div className="label">Subtotal</div>
                      <div className="value">
                        {formatToMoney(order.summary.subtotal, true)}
                      </div>
                    </div>
                    <div className="sales-tax">
                      <div className="label">Sales Tax</div>
                      <div className="value">
                        {formatToMoney(order.summary.salesTax, true)}
                      </div>
                    </div>
                    <div className="shipping-total">
                      <div className="label">Shipping &amp; Handling</div>
                      <div className="value">
                        {formatToMoney(order.summary.shipping, true)}
                      </div>
                    </div>
                    <div className="total">
                      <div>Order Total</div>
                      <div className="value">
                        {formatToMoney(order.summary.total, true)}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            </div>
          )}
          <div className="footer">
            &copy; 2021 Macaport. All Rights Reserved.
          </div>
        </div>
      </OrderConfirmationStyles>
    </>
  );
}

const OrderConfirmationStyles = styled.div`
  padding: 0 1.5rem;
  height: 100%;

  .wrapper {
    margin: 0 auto;
    max-width: 78rem;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .header {
    padding: 0.875rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #e5e7eb;
  }

  .logo {
    width: 16rem;

    img {
      width: 100%;
    }
  }

  .print-only {
    display: none;
  }

  .print-button {
    padding: 0.625rem 1.25rem;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 0.9375rem;
    font-weight: 500;
    color: #374151;
    background-color: #fff;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    cursor: pointer;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    svg {
      margin: 0 0.5rem 0 0;
      height: 1.125rem;
      width: 1.125rem;
      color: #9ca3af;
    }

    &:hover {
      background-color: #f9fafb;
    }
  }

  .main-content {
    padding: 4rem 0;
    display: grid;
    grid-template-columns: minmax(30rem, 36rem) minmax(30rem, 36rem);
    justify-content: space-between;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.75rem;
    font-weight: 700;
    color: #111827;
    line-height: 1.35;
  }

  h5 {
    margin: 0 0 1rem;
    font-size: 0.875rem;
    font-weight: 700;
    color: #4338ca;
    text-transform: uppercase;
    letter-spacing: 0.075em;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.5;

    a {
      color: #4338ca;
      text-decoration: underline;
    }
  }

  .explanation {
    padding: 0 3rem 0 0;
  }

  .order-metadata {
    padding: 4rem 0;
  }

  .order-number,
  .transaction-id,
  .order-date,
  .store-name {
    font-size: 1rem;
    font-weight: 400;
    color: #6b7280;

    span {
      display: inline-flex;
      width: 9rem;
      color: #111827;
      font-weight: 600;
    }
  }

  .order-number,
  .transaction-id,
  .order-date {
    margin: 0 0 0.625rem;
  }

  .order {
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
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
    }
  }

  .item {
    padding: 1.125rem 0;
    display: grid;
    grid-template-columns: 5.5rem 1fr 4rem;
    grid-template-areas:
      'img name total'
      'img quantity total'
      'img color total'
      'img size total';
    border-bottom: 1px solid #e5e7eb;
  }

  .item-img {
    grid-area: img;
  }

  .item-name {
    grid-area: name;
  }

  .item-quantity {
    grid-area: quantity;
  }

  .item-color {
    grid-area: color;
  }

  .item-size {
    grid-area: size;
  }

  .item-total {
    grid-area: total;
    text-align: right;
  }

  .item-img {
    padding: 0.125rem 0.5rem;
    width: 5.5rem;
    background-color: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    img {
      width: 100%;
    }
  }

  .item-name,
  .item-total {
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
  }

  .item-quantity,
  .item-color,
  .item-size {
    margin: 0.1875rem 0 0;
    font-size: 1rem;
    color: #6b7280;
  }

  .item-name,
  .item-quantity,
  .item-color,
  .item-size {
    padding: 0 0 0 1.25rem;
  }

  .order-summary {
    padding: 0.75rem 0 0;
  }

  .subtotal,
  .sales-tax,
  .shipping-total {
    padding: 0.75rem 0;
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    color: #4b5563;

    .label {
      color: #6b7280;
    }

    .value {
      color: #111827;
    }
  }

  .total {
    margin: 0.5rem 0 0;
    padding: 1.25rem 0 0;
    display: flex;
    justify-content: space-between;
    font-size: 1rem;
    font-weight: 600;
    color: #111827;
    border-top: 1px solid #e5e7eb;

    .value {
      color: #059669;
    }
  }

  .order-info {
    h3 {
      margin: 0 0 0.75rem;
      font-size: 1.125rem;
      font-weight: 600;
      color: #1f2937;
    }

    .name,
    .email,
    .phone,
    .shipping-address {
      font-size: 1rem;
      color: #6b7280;
      line-height: 1.5;
    }
  }

  .customer {
    padding: 0 0 4rem;
  }

  .footer {
    margin-top: auto;
    padding: 2rem 0;
    font-size: 1rem;
    color: #9ca3af;
    text-align: center;
    border-top: 1px solid #e5e7eb;
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

  @media screen and (max-width: 1024px) {
    .header {
      justify-content: center;
    }

    .main-content {
      grid-template-columns: 1fr;
    }

    .explanation {
      padding: 0;
    }

    .order-metadata {
      padding-bottom: 0;
    }

    .order-info {
      display: grid;
      grid-template-columns: repeat(auto-fill, 22rem);
      justify-content: space-between;
    }

    .customer,
    .shipping-details {
      padding: 4rem 0 0;
    }

    .order {
      margin: 4rem 0 0;
      max-width: 100%;
    }
  }

  @media screen and (max-width: 600px) {
    .main-content {
      padding-bottom: 0;
      display: block;
    }

    .order-metadata {
      span {
        margin: 0 0 0.25rem;
        display: block;
      }

      .order-number,
      .transaction-id,
      .order-date {
        margin: 0 0 2rem;
      }
    }

    .order-info {
      display: block;
    }

    .customer,
    .shipping-details {
      padding: 2rem 0 0;
    }

    .order {
      padding: 1.5rem 1rem;
    }

    .item {
      grid-template-columns: 5.5rem 1fr;
      grid-template-areas:
        'name name'
        'img quantity'
        'img color'
        'img size'
        'img total';

      &:first-of-type {
        border-top: 1px solid #e5e7eb;
      }
    }

    .item-name {
      margin: 0 0 1rem;
      padding-left: 0;
    }

    .item-quantity,
    .item-color,
    .item-size,
    .item-total {
      padding: 0 0 0 1.5rem;
      text-align: right;
    }

    .footer {
      border-top: none;
    }

    .error {
      margin: 2rem auto 0;
    }
  }

  @media print {
    @page {
      margin-top: 0;
      margin-bottom: 0;
    }

    @media (resolution: 300dpi) {
      .wrapper {
        display: block;
      }

      .header {
        padding-top: 4rem;
        border-color: #d4d4d4;
      }

      .print-only {
        display: block;
      }

      .support-link {
        font-size: 1rem;
        color: #9ca3af;
        text-align: right;

        &:first-of-type {
          margin: 0 0 0.25rem;
        }
      }

      .main-content {
        padding-top: 3rem;
        grid-template-columns: minmax(30rem, 34rem) minmax(30rem, 38rem);
      }

      .order {
        border: none;
        box-shadow: none;
      }

      .item {
        padding: 0.75rem 0;
        grid-template-columns: 2.5rem 1fr 4rem;
        grid-template-areas:
          'img name name total'
          'img quantity color size';
        border-color: #d4d4d4;
      }

      .item-name,
      .item-quantity {
        padding-left: 1rem;
      }

      .item-color,
      .item-size {
        padding-left: 0;
      }

      .item-size {
        text-align: right;
      }

      .item-img {
        padding: 0;
        width: 2.5rem;
        background-color: transparent;
        border: none;
        box-shadow: none;
      }

      .total {
        border-color: #d4d4d4;
      }

      .footer {
        display: none;
      }
    }
  }
`;

const GlobalStyles = createGlobalStyle`
  @font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 400;
  font-display: swap;
  src: url("/fonts/Inter-Regular.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Regular.woff?v=3.18") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 500;
  font-display: swap;
  src: url("/fonts/Inter-Medium.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Medium.woff?v=3.18") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 600;
  font-display: swap;
  src: url("/fonts/Inter-SemiBold.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-SemiBold.woff?v=3.18") format("woff");
}

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 700;
  font-display: swap;
  src: url("/fonts/Inter-Bold.woff2?v=3.18") format("woff2"),
       url("/fonts/Inter-Bold.woff?v=3.18") format("woff");
}

  html,
  body {
  padding: 0;
  margin: 0;
  height: 100%;
  position: relative;
  font-size: 16px;
  letter-spacing: -0.011em;
  background-color: #f7f9fb;
  -webkit-font-smoothing: antialiased;
  font-feature-settings: "cv02","cv03","cv04","cv09", "cv11";
}

html, body, button, input, select {
  font-family: 'Inter',-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

#__next {
  height: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

* {
  box-sizing: border-box;
  outline-color: #4F46E5;
}

.sr-only {
  position: absolute;
  clip: rect(1px, 1px, 1px, 1px);
  padding: 0;
  border: 0;
  height: 1px;
  width: 1px;
  overflow: hidden;
}

label {
  margin: 0 0 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6e788c;
}

input, select {
  appearance: none;
  background-color: #fff;
  border: 1px solid #dddde2;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
}

input:not([type="checkbox"], [type="radio"]) {
  padding: 0.6875rem 0.75rem;

  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, #4F46E5 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    border: 1px solid #4F46E5;
  }
}

input[type="checkbox"]:checked, input[type='radio']:checked {
  border-color: transparent;
  background-color: currentColor;
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
}

input[type='checkbox']:focus, input[type='radio']:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, rgb(99, 102, 241) 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
}

input[type='checkbox'] {
  padding: 0;
  width: 1rem;
  height: 1rem;
  display: inline-block;
  vertical-align: middle;
  user-select: none;
  flex-shrink: 0;
  border-radius: 0.25rem;
  color: rgb(79, 70, 229);
}

input[type="checkbox"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
}

input[type="radio"] {
  margin: 0%;
  height: 1rem;
  width: 1rem;
  border-radius: 100%;
  flex-shrink: 0;
  color: rgb(79,70,229);
}

input[type="radio"]:checked {
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3ccircle cx='8' cy='8' r='3'/%3e%3c/svg%3e");
}

select {
  padding: 0.6875rem 2.5rem 0.75rem 0.75rem;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none'%3E%3Cpath d='M7 7l3-3 3 3m0 6l-3 3-3-3' stroke='%239fa6b2' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-size: 1.375em 1.375em;
  background-repeat: no-repeat;
  color-adjust: exact;
  border: 1px solid #dddde2;
  border-radius: 0.375rem;
  font-weight: 500;
  color: #36383e;
  cursor: pointer;
}

select:focus {
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, #4F46E5 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  border: 1px solid #4F46E5;

}

@media (max-width: 500px) {
  input, select {
    font-size: 1rem;
  }
}

@media print {
  body, html {
    background-color: #fff;
  }

  header, footer {
    display: none;
  }
}
`;
