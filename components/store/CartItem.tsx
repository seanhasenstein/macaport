import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useCart } from '../../hooks/useCart';
import { formatToMoney } from '../../utils';
import { CartItem as CartItemInterface } from '../../interfaces';

const CartItemStyles = styled.div`
  padding: 2.25rem 0;
  display: grid;
  grid-template-areas:
    'image details total'
    'image inputs button';
  grid-template-columns: 8rem 1fr 10rem;
  gap: 0 1.5rem;
  border-bottom: 1px solid #e5e7eb;

  &:last-of-type {
    border: none;
  }

  .item-image {
    grid-area: image;

    a {
      padding: 0.5rem 0.75rem;
      width: 7.5rem;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 0.25rem;
      border: 1px solid #e5e7eb;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    img {
      width: 100%;
    }
  }

  .item-details {
    grid-area: details;
    display: flex;
    flex-direction: column;
  }

  .primary {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    color: #36383e;
  }

  .secondary {
    margin: 0.5rem 0 0;
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: 400;
    color: #6e788c;
  }

  .color {
    margin: 0.125rem 0 0 0.5rem;
    height: 0.9375rem;
    width: 0.9375rem;
    background-color: ${(props: { item: CartItemInterface }) => {
      const color = props.item.colors.find(c => c.label === props.item.color);
      return color ? color.hex : props.item.color.toLowerCase();
    }};
    border-radius: 9999px;
    border: 1px solid #374151;
  }

  .inputs {
    grid-area: inputs;
    display: grid;
    grid-template-columns: 1fr 0.7fr;
    gap: 0 1rem;
    align-items: flex-end;
  }

  .size,
  .quantity {
    display: flex;
    flex-direction: column;

    label {
      font-size: 0.8125rem;
    }
  }

  .total {
    grid-area: total;
    display: flex;
    justify-content: flex-end;
    font-size: 1rem;
    font-weight: 600;
    color: #36383e;
  }

  .remove-btn {
    grid-area: button;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;

    button {
      padding: 0;
      font-size: 0.875rem;
      font-weight: 400;
      text-decoration: underline;
      color: #6b7280;
      background-color: transparent;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
  }

  .remove-btn:hover {
    color: #4b5563;
  }

  @media (max-width: 1000px) {
    margin: 0 auto;
    width: 100%;
    grid-template-areas:
      'image details total'
      'image inputs inputs'
      'button button button';
    grid-template-columns: 5rem 1fr 3rem;
    gap: 0 1rem;

    .item-image {
      height: 100%;

      a {
        padding: 0.5rem;
        width: 100%;
        height: 100%;
      }
    }

    .primary,
    .secondary,
    .total {
      font-size: 0.875rem;
    }

    .inputs {
      margin: 1.25rem 0 0;
      grid-template-columns: 1fr 1fr;

      select {
        font-size: 0.8125rem;
      }
    }

    .remove-btn {
      margin: 1.125rem 0 0;

      button {
        padding: 0.5rem 0;
        width: 100%;
        font-weight: 500;
        color: #374151;
        text-decoration: none;
        background-color: #f3f4f6;
        border: 1px solid #e5e7eb;
      }
    }
  }
`;

type Props = {
  item: CartItemInterface;
  storeId: string;
};

export default function CartItem({ item, storeId }: Props) {
  const [size, setSize] = React.useState(item.size.label);
  const [quantity, setQuantity] = React.useState(item.quantity);
  const { removeItem, updateItemSize, updateItemQuantity } = useCart();

  React.useEffect(() => {
    setSize(item.size.label);
    setQuantity(item.quantity);
  }, [item]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sku = item.skus.find(
      sku => sku.size.label === e.target.value && sku.color.label === item.color
    );

    if (!sku) {
      // todo: look at this and figure out how to alert the user if no sku is found
      // possible message: 'an error has occured, please refresh and try again'.
      throw new Error('No sku found!');
    }

    setSize(sku.size.label);
    updateItemSize(item.id, {
      ...item,
      id: sku?.id,
      size: sku.size,
      quantity,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    updateItemQuantity(item.id, newQuantity);
  };

  return (
    <CartItemStyles item={item}>
      <div className="item-image">
        <Link
          href={`/store/${storeId}/product?productId=${item.productId}&color=${item.color}`}
        >
          <a>
            <img src={item.image} alt={`${item.color} ${item.name}`} />
          </a>
        </Link>
      </div>
      <div className="item-details">
        <h3 className="primary">
          <Link
            href={`/store/${storeId}/product?productId=${item.productId}&color=${item.color}`}
          >
            <a>{item.name}</a>
          </Link>
        </h3>

        <p className="secondary">
          {item.color} <span className="color" />
        </p>
      </div>
      <div className="total">{formatToMoney(item.itemTotal!)}</div>
      <div className="inputs">
        <div className="size">
          <label htmlFor="size">Size</label>
          <select
            name="size"
            id="size"
            value={size}
            onChange={handleSizeChange}
            onBlur={handleSizeChange}
          >
            {item.sizes.map(size => (
              <option key={size.id} value={size.label}>
                {size.label}
              </option>
            ))}
          </select>
        </div>
        <div className="quantity">
          <label htmlFor="quantity">Qty</label>
          <select
            name="quantity"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
            onBlur={handleQuantityChange}
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
            <option value="9">9</option>
            <option value="10">10</option>
          </select>
        </div>
      </div>
      <div className="remove-btn">
        <button type="button" onClick={() => removeItem(item.id)}>
          Remove from cart
        </button>
      </div>
    </CartItemStyles>
  );
}
