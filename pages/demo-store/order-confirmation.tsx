import { GetServerSideProps } from 'next';
import React from 'react';
import styled from 'styled-components';
import Layout from '../../components/demo-store/Layout';
import OrderTotals from '../../components/demo-store/OrderTotals';
import { formatToMoney, formatDate } from '../../utils';
import { CartItem, Order } from '../../interfaces';
import { connectToDb, order } from '../../db';

type OrderConfirmationProps = {
  order: Order;
  error?: string;
};

type InfoItemProps = {
  field: string;
  value: string | Date;
};

type OrderItemProps = {
  item: CartItem;
};

const OrderConfirmationStyles = styled.div`
  padding: 1.5rem;

  .receipt {
    margin: 0 auto;
    padding: 2.5rem 4rem 0.5rem;
    max-width: 48rem;
    width: 100%;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .header {
    margin: 0 0 1.5rem;
    padding: 0 0 1.5rem;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #ddd;
  }

  .logo {
    margin: 0 1.875rem 0 0;
    flex-shrink: 0;
    width: 5rem;

    img {
      width: 100%;
    }
  }

  h2 {
    margin: 0 0 0.25rem;
    line-height: 1.25;
    font-size: 1.25rem;
    font-weight: 600;
    color: #232328;
  }

  .order-id {
    font-size: 0.9375rem;
    color: #89899a;
  }

  p {
    margin: 0;
    font-size: 0.9375rem;
    line-height: 1.5;
    color: #6e788c;

    a {
      color: #3b82f6;

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .customer-details {
    margin: 3rem 0;
  }

  .order-summary {
    margin: 3rem 0;
    display: flex;
    justify-content: flex-end;

    .wrapper {
      max-width: 17rem;
      width: 100%;
    }
  }

  .title {
    margin: 0 0 1.375rem;
    font-size: 0.875rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.025em;
    color: #232328;
  }

  .footer {
    padding: 1.25rem 0;
    border-top: 1px solid #ddd;
    font-size: 0.875rem;
    line-height: 1.25;
    color: #6e788c;
  }

  @media (max-width: 700px) {
    .receipt {
      padding: 2rem 1.5rem 0;
    }

    .header {
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .logo {
      margin: 0 0 0.375rem;
      width: 4rem;
    }

    .footer {
      text-align: center;
    }
  }

  @media (max-width: 500px) {
    .order-summary .wrapper {
      max-width: unset;
    }
  }

  @media print {
    margin: 0;
    padding: 0;

    .receipt {
      margin: 0;
      padding: 0;
      max-width: 100%;
      background-color: transparent;
      border: none;
      box-shadow: none;
    }

    p {
      color: #222;
    }

    .customer-details,
    .order-summary {
      margin: 4rem 0;
      page-break-inside: avoid;
    }
  }

  @page {
    margin: 2cm 2.5cm;
  }
`;

const InfoItemStyles = styled.div`
  margin: 0 0 0.25rem;
  display: flex;
  font-size: 0.9375rem;
  color: #232328;

  .heading {
    width: 4rem;
    font-weight: 600;
  }

  @media (max-width: 400px) {
    margin: 0 0 1.5rem;
    flex-direction: column;
    align-items: center;

    .heading {
      margin: 0 0 0.375rem;
      width: unset;
    }
  }
`;

const OrderItemStyles = styled.div`
  padding: 0.875rem 0;
  display: grid;
  grid-template-columns: 2.625rem 16rem 4rem 4rem;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;

  &:first-of-type {
    border-top: 1px solid #e5e7eb;
  }

  .image {
    width: 100%;
  }

  .details {
    display: flex;
    flex-direction: column;

    h3 {
      margin: 0;
      font-size: 0.875rem;
      font-weight: 600;
    }

    p {
      margin: 0.1875rem 0 0;
      font-size: 0.875rem;
      color: #9e9eac;
      text-align: left;
    }
  }

  .quantity {
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #3d3d48;

    span {
      margin-right: 0.75rem;
      font-weight: 400;
      color: #9e9eac;
    }
  }

  .total {
    display: flex;
    justify-content: flex-end;
    font-size: 0.875rem;
    font-weight: 600;
    color: #3d3d48;
  }

  @media (max-width: 600px) {
    grid-template-columns: 2.625rem 1fr 1fr;
    grid-template-areas:
      'image details details'
      'image details details'
      'image quantity total';
    gap: 0.25rem 1rem;
    align-items: flex-start;

    .image {
      grid-area: image;
    }

    .details {
      grid-area: details;
    }

    .quantity {
      grid-area: quantity;
      justify-content: flex-start;
    }

    .total {
      grid-area: total;
    }
  }

  @media print {
    page-break-inside: avoid;
  }
`;

const ErrorStyles = styled.div`
  margin: 4rem 0;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  line-height: 1.5;

  p {
    margin: 0 0 0.5rem;
  }
`;

function InfoItem({ field, value }: InfoItemProps) {
  return (
    <InfoItemStyles>
      <div className="heading">{field}:</div>
      <div className="value">{value}</div>
    </InfoItemStyles>
  );
}

function OrderItem({ item }: OrderItemProps) {
  return (
    <OrderItemStyles>
      <img src={item.image} alt={item.name} className="image" />
      <div className="details">
        <h3>{item.name}</h3>
        <p>
          Color: {item.color} | Size: {item.size}
        </p>
      </div>
      <div className="quantity">
        <span>Qty:</span>
        {item.quantity}
      </div>
      <div className="total">{formatToMoney(item.itemTotal!)}</div>
    </OrderItemStyles>
  );
}

export default function OrderConfirmation({
  order,
  error,
}: OrderConfirmationProps) {
  if (error) {
    return (
      <Layout>
        <ErrorStyles>
          <p>Error:</p>
          <p>{error}</p>
        </ErrorStyles>
      </Layout>
    );
  }

  return (
    <Layout title="Order Confirmation | Macaport">
      <OrderConfirmationStyles>
        <div className="receipt">
          <div className="header">
            <div className="logo">
              <img src="/images/logo-round.png" alt="Macaport with mountains" />
            </div>
            <div>
              <h2>Macaport Demo Store Receipt</h2>
              <div className="order-id">Order #{order.orderId}</div>
            </div>
          </div>
          <div>
            <p>
              We&apos;ve received your order! You should receive a confirmation
              email shortly. If you have any questions about your order you can
              email us at <a href="#">info@email.com</a> (This receipt is for
              demo and testing purposes only. It is not a real transaction).
            </p>
          </div>
          <div className="customer-details">
            <InfoItem field="Date" value={formatDate(`${order.createdAt!}`)} />
            <InfoItem
              field="Name"
              value={`${order.customer.firstName} ${order.customer.lastName}`}
            />
            <InfoItem field="Email" value={order.customer.email} />
          </div>
          <div>
            <h3 className="title">Order Items</h3>
            {order.items.map(i => (
              <OrderItem key={i.id} item={i} />
            ))}
          </div>
          <div className="order-summary">
            <div className="wrapper">
              <h3 className="title">Order Summary</h3>
              <OrderTotals
                subtotal={order.summary.subtotal}
                transactionFee={order.summary.transactionFee}
                total={order.summary.total}
              />
            </div>
          </div>
          <div className="footer">
            &copy; Macaport 2021. All Rights Reserved.
          </div>
        </div>
      </OrderConfirmationStyles>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async context => {
  try {
    if (context.query === undefined || context.query.id === undefined) {
      throw new Error('No order number was provided.');
    }

    const id = Array.isArray(context.query.id)
      ? context.query.id[0]
      : context.query.id;

    const { db } = await connectToDb();
    const result = await order.getOrder(db, id);

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
