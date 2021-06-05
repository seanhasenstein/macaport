import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useCart } from '../../hooks/useCart';
import { formatToMoney } from '../../utils';
import { CartItem as CartItemInterface } from '../../interfaces';

const CartItemStyles = styled.div`
  padding: 1.5rem 0;
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e7eb;

  &:last-of-type {
    border-bottom: none;
  }

  .image {
    width: 3.75rem;
  }

  .item-details {
    display: flex;
    flex-direction: column;
    max-width: 225px;
    width: 100%;
  }

  .primary {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #36383e;
  }

  .secondary,
  .price {
    margin: 0.125rem 0 0;
    font-size: 0.875rem;
    font-weight: 400;
    color: #6e788c;
  }

  .inputs {
    display: grid;
    grid-template-columns: 9.5rem 5rem;
    gap: 1rem;
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
    min-width: 4.75rem;
    display: flex;
    justify-content: center;
    font-size: 0.875rem;
    font-weight: 600;
    color: #36383e;
  }

  .remove-btn {
    padding: 0.3125rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: #6e788c;
    border: 2px solid transparent;
    border-radius: 4px;
    cursor: pointer;
  }

  .remove-btn span {
    display: none;
  }

  .remove-btn:hover {
    color: #080809;
  }

  .remove-btn svg {
    height: 1.125rem;
    width: 1.125rem;
  }

  .remove-btn:focus {
    outline: none;
    box-shadow: 0 0 0 4px rgba(153, 155, 166, 0.4);
    border-color: #999ba6;
  }

  @media (max-width: 800px) {
    margin: 0 0 1.25rem;
    padding: 2rem 0;
    flex-direction: column;
    background-color: #fcfcfd;
    border-radius: 0.5rem;
    border: none;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

    .image {
      width: 7rem;
    }

    .item-details {
      margin: 1.25rem 0;
      max-width: unset;
      align-items: center;
    }

    .primary {
      font-size: 1rem;
    }

    .total {
      margin: 2rem 0 0;
    }

    .remove-btn {
      margin: 0;
      padding: 0.375rem;
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background-color: #f5f5f5;
      border-radius: 9999px;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    .remove-btn svg {
      height: 1rem;
      width: 1rem;
    }
  }
`;

type Props = {
  item: CartItemInterface;
};

export default function CartItem({ item }: Props) {
  const [size, setSize] = React.useState(item.size);
  const [quantity, setQuantity] = React.useState(item.quantity);
  const { removeItem, updateItem, updateItemQuantity } = useCart();

  React.useEffect(() => {
    setSize(item.size);
    setQuantity(item.quantity);
  }, [item]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sku = item.skus.find(
      sku => sku.size === e.target.value && sku.color.label === item.color
    );

    setSize(e.target.value);
    updateItem(item.id, {
      id: sku?.id,
      prevId: item.id,
      size: e.target.value,
      quantity,
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    updateItemQuantity(item.id, newQuantity);
  };

  return (
    <CartItemStyles>
      <Link href={`/demo-store/product/${item.productId}`}>
        <a>
          <img
            src={item.image}
            alt={`${item.color} ${item.name}`}
            className="image"
          />
        </a>
      </Link>
      <div className="item-details">
        <Link href={`/demo-store/product/${item.productId}`}>
          <a>
            <h3 className="primary">{item.name}</h3>
          </a>
        </Link>
        <p className="secondary">Color: {item.color}</p>
        <p className="price">{formatToMoney(item.price)}</p>
      </div>
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
              <option key={size} value={size}>
                {size}
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
      <div className="total">{formatToMoney(item.itemTotal!)}</div>
      <button
        type="submit"
        className="remove-btn"
        onClick={() => removeItem(item.id)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
        <span className="sr-only">Remove Item</span>
      </button>
    </CartItemStyles>
  );
}
