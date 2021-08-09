import styled from 'styled-components';
import { CartItem } from '../../interfaces';
import { formatToMoney } from '../../utils';

export default function CheckoutItem({ item }: { item: CartItem }) {
  return (
    <CheckoutItemStyles item={item}>
      <div className="image">
        <img src={item.image} alt={`${item.sku.color.label} ${item.name}`} />
      </div>
      <div className="name">{item.name}</div>
      <div className="total">{formatToMoney(item.itemTotal!)}</div>
      <div className="color">
        <span />
        {item.sku.color.label}
      </div>
      <div className="size">Size: {item.sku.size.label}</div>
      <div className="quantity">Qty: {item.quantity}</div>
    </CheckoutItemStyles>
  );
}

const CheckoutItemStyles = styled.div`
  width: 100%;
  padding: 1.5rem 0;
  display: grid;
  grid-template-areas:
    'image name total'
    'image color .'
    'image size quantity';
  grid-template-columns: 4rem 1fr 3rem;
  gap: 0 1rem;
  border-bottom: 1px solid #e5e7eb;

  .image {
    padding: 0.25rem;
    grid-area: image;
    background-color: #fff;
    border-radius: 0.375rem;
    border: 1px solid #e5e7eb;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    img {
      width: 100%;
    }
  }

  .name,
  .total {
    color: #111827;
  }

  .name {
    grid-area: name;
    font-weight: 500;
  }

  .total {
    grid-area: total;
    text-align: right;
    font-weight: 600;
  }

  .color {
    grid-area: color;
    display: flex;
    align-items: center;
    font-size: 0.875rem;
    color: #4b5563;

    span {
      margin: 0.125rem 0.5rem 0 0;
      display: inline-block;
      height: 0.9375rem;
      width: 0.9375rem;
      background-color: ${(props: { item: CartItem }) =>
        props.item.sku.color.hex};
      border-radius: 9999px;
      border: 1px solid #9ca3af;
    }
  }

  .size {
    grid-area: size;
    display: flex;
    align-items: flex-end;
    font-size: 0.875rem;
    color: #4b5563;
  }

  .quantity {
    grid-area: quantity;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    font-size: 0.875rem;
    color: #4b5563;
    text-align: right;
  }
`;
