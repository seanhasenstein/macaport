import styled from 'styled-components';
import { CartItem } from '../../interfaces';
import { formatToMoney } from '../../utils';

const CheckoutItemStyles = styled.div`
  /* max-width: 26rem; */
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
      background-color: ${(props: { item: CartItem }) => {
        const color = props.item.colors.find(c => c.label === props.item.color);
        return color ? color.hex : props.item.color.toLowerCase();
      }};
      border-radius: 9999px;
      border: 1px solid #374151;
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

export default function CheckoutItem({ item }: { item: CartItem }) {
  return (
    <CheckoutItemStyles item={item}>
      <div className="image">
        <img src={item.image} alt={`${item.color} ${item.name}`} />
      </div>
      <div className="name">{item.name}</div>
      <div className="total">{formatToMoney(item.itemTotal!)}</div>
      <div className="color">
        <span />
        {item.color}
      </div>
      <div className="size">Size: {item.size.label}</div>
      <div className="quantity">Qty: {item.quantity}</div>
    </CheckoutItemStyles>
  );
}
