import React from 'react';
import styled from 'styled-components';
import { formatToMoney } from '../../utils';

const OrderTotalsStyles = styled.div`
  display: flex;
  flex-direction: column;

  .item {
    padding: 0.25rem 0;
    display: flex;
    justify-content: space-between;
    font-size: 0.9375rem;

    &:last-of-type {
      margin: 0.25rem 0 0;
      padding: 0.5rem 0 0;
      font-weight: 600;
      border-top: 1px solid #dadde2;

      & .amount {
        color: #2d9542;
      }
    }
  }

  @media (max-width: 800px) {
    padding: 0 0.25rem;
    max-width: unset;
  }
`;

type ItemProps = {
  heading: string;
  amount: string;
};

type OrderTotalsProps = {
  subtotal: number;
  transactionFee: number;
  total: number;
};

function Item({ heading, amount }: ItemProps) {
  return (
    <div className="item">
      <div className="heading">{heading}</div>
      <div className="amount">{amount}</div>
    </div>
  );
}

export default function OrderTotals({
  subtotal,
  transactionFee,
  total,
}: OrderTotalsProps) {
  return (
    <OrderTotalsStyles>
      <Item heading="Subtotal" amount={formatToMoney(subtotal, true)} />
      <Item heading="Sales Tax" amount={formatToMoney(transactionFee, true)} />
      <Item heading="Total" amount={formatToMoney(total, true)} />
    </OrderTotalsStyles>
  );
}
