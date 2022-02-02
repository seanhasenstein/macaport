import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { useCart } from '../../hooks/useCart';
import { formatToMoney } from '../../utils';
import {
  CartItem as CartItemInterface,
  ProductSku,
  ProductSize,
} from '../../interfaces';

type Props = {
  item: CartItemInterface;
  storeId: string;
  skus: ProductSku[];
  sizes: ProductSize[];
};

export default function CartItem({ item, storeId, skus }: Props) {
  const [size, setSize] = React.useState(item.sku.size.label);
  const [quantity, setQuantity] = React.useState(item.quantity);
  const { items, removeItem, updateItemSize, updateItemQuantity } = useCart();

  React.useEffect(() => {
    setSize(item.sku.size.label);
    setQuantity(item.quantity);
  }, [item]);

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sku = skus.find(
      sku =>
        sku.size.label === e.target.value &&
        sku.color.label === item.sku.color.label
    );

    if (sku) {
      setSize(sku.size.label);
      updateItemSize(item.id, item.sku.id, {
        ...item,
        id: `${sku.id}${item.customName}${item.customNumber}`,
        sku,
        quantity,
      });
    }
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    updateItemQuantity(item.id, newQuantity);
  };

  const isSizeOutOfStock = (items: CartItemInterface[], sku: ProductSku) => {
    const currentSize = sku.size.label === size;
    const updatedInventory = items.reduce((inventory, currentItem) => {
      if (currentItem.sku.id === sku.id) {
        return inventory - currentItem.quantity;
      }
      return inventory;
    }, sku.inventory);

    if (updatedInventory < 1 && !currentSize) {
      return true;
    }

    return false;
  };

  const isOptionDisabled = (
    items: CartItemInterface[],
    cartItem: CartItemInterface,
    optionValue: number
  ) => {
    const cartQuantity = items.reduce((cartQuantity, currentCartItem) => {
      if (currentCartItem.sku.id === cartItem.sku.id) {
        return cartQuantity + currentCartItem.quantity;
      }
      return cartQuantity;
    }, 0);

    if (
      optionValue >
      cartItem.quantity + (cartItem.sku.inventory - cartQuantity)
    ) {
      return true;
    }

    return false;
  };

  return (
    <CartItemStyles>
      <div className="item-image">
        <Link
          href={`/store/${storeId}/product?productId=${item.sku.storeProductId}&colorId=${item.sku.color.id}`}
        >
          <a>
            <img
              src={item.image}
              alt={`${item.sku.color.label} ${item.name}`}
            />
          </a>
        </Link>
      </div>
      <div className="item-details">
        <h3 className="primary">
          <Link
            href={`/store/${storeId}/product?productId=${item.sku.storeProductId}&colorId=${item.sku.color.id}`}
          >
            <a>{item.name}</a>
          </Link>
        </h3>
        <div className="secondary-details">
          <p className="secondary">
            Color: <span className="value">{item.sku.color.label}</span>{' '}
          </p>
          {item.customName && (
            <p className="secondary">
              Name: <span className="value">{item.customName}</span>
            </p>
          )}
          {item.customNumber && (
            <p className="secondary">
              Number: <span className="value">{item.customNumber}</span>
            </p>
          )}
        </div>
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
          >
            {skus.map(sku => {
              if (sku.color.id === item.sku.color.id) {
                return (
                  <option
                    key={sku.size.id}
                    value={sku.size.label}
                    disabled={isSizeOutOfStock(items, sku)}
                  >
                    {sku.size.label}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className="quantity">
          <label htmlFor="quantity">Qty</label>
          <select
            name="quantity"
            id="quantity"
            value={quantity}
            onChange={handleQuantityChange}
          >
            {[...Array(11)].map((_v, i) => {
              if (i === 0) return;
              return (
                <option
                  key={i}
                  value={`${i}`}
                  disabled={isOptionDisabled(items, item, i)}
                >
                  {i}
                </option>
              );
            })}
          </select>
        </div>
      </div>
      <div className="remove-button">
        <button type="button" onClick={() => removeItem(item.id)}>
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span className="sr-only">Remove from cart</span>
        </button>
      </div>
    </CartItemStyles>
  );
}

const CartItemStyles = styled.div`
  padding: 2.5rem 0;
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
    line-height: 1.35;
  }

  .secondary-details {
    margin: 0.5rem 0 0;
  }

  .secondary {
    margin: 0 0 0.375rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    font-size: 0.9375rem;
    font-weight: 400;
    color: #6e788c;

    .value {
      margin: 0 0 0 0.375rem;
      color: #111827;
    }
  }

  .inputs {
    margin: 0.875rem 0 0;
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

  .remove-button {
    grid-area: button;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;

    button {
      padding: 0.25rem;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      font-size: 0.875rem;
      font-weight: 400;
      text-decoration: underline;
      color: #6b7280;
      background-color: transparent;
      border: none;
      border-radius: 4px;
      cursor: pointer;

      &:hover,
      &:hover svg {
        color: #6b7280;
      }

      svg {
        height: 1.125rem;
        width: 1.125rem;
        color: #9ca3af;
      }
    }
  }

  .remove-button:hover {
    color: #4b5563;
  }

  @media (max-width: 700px) {
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

    .remove-button {
      margin: 1.125rem 0 0;

      button {
        padding: 0.5rem 0;
        width: 100%;
        font-weight: 500;
        color: #374151;
        text-decoration: none;
        background-color: #f3f4f6;
        border: 1px solid #e5e7eb;

        .sr-only {
          position: inherit;
          clip: inherit;
          padding: 0;
          border: none;
          height: inherit;
          width: inherit;
          overflow: inherit;
        }

        svg {
          display: none;
        }

        &:hover {
          color: #111827;
        }
      }
    }
  }
`;
