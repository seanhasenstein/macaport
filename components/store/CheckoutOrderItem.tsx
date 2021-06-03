import React from 'react';
import styled from 'styled-components';
import { CartItem } from '../../interfaces';
import { formatToMoney } from '../../utils';

const OrderItemStyles = styled.div`
  padding: 1.25rem 0;
  display: grid;
  grid-template-columns: 2.5rem auto;
  gap: 1rem;
  font-size: 0.875rem;
  border-bottom: 1px solid #e5e7eb;

  .item-img {
    width: 100%;
  }

  .item-primary {
    font-weight: 600;
  }

  .item-secondary,
  .item-quantity,
  .item-total {
    color: #808490;
  }

  .item-primary,
  .item-secondary,
  .item-quantity {
    margin: 0 0 0.125rem;
  }
`;

export default function CheckoutOrderItem({ item }: { item: CartItem }) {
  return (
    <OrderItemStyles>
      <img src={item.image} alt={item.name} className="item-img" />
      <div className="item-details">
        <div className="item-primary">{item.name}</div>
        <div className="item-secondary">
          Color: {item.color} | Size: {item.size}
        </div>
        <div className="item-quantity">
          Qty: {item.quantity} @ {formatToMoney(item.price)}
        </div>
        <div className="item-total">{formatToMoney(item.itemTotal!, true)}</div>
      </div>
    </OrderItemStyles>
  );
}
