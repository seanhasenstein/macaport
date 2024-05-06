import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import {
  CartItem as CartItemInterface,
  ProductSku,
  ProductSize,
} from '../../../interfaces';
import { useCart } from '../../../hooks/useCart';
import useCartItem from 'hooks/useCartItem';
import { formatToMoney } from '../../../utils';

type Props = {
  item: CartItemInterface;
  storeId: string;
  skus: ProductSku[];
  sizes: ProductSize[];
  isDemo: boolean;
  isTeacherAppreciationStore?: boolean;
  teacherAppreciationEmail?: string;
  cartHasFreeItem?: boolean;
  eligibleForTeacherAppreciation?: boolean;
};

export default function CartItem(props: Props) {
  const { items, removeItem, updateItemSize, updateItemQuantity } = useCart();

  const cartItem = useCartItem({
    cartItem: props.item,
    skus: props.skus,
    updateItemQuantity,
    updateItemSize,
  });

  const renderTeacherAppreciation =
    props.eligibleForTeacherAppreciation &&
    props.teacherAppreciationEmail &&
    props.cartHasFreeItem &&
    props.item.itemTotal === 0;

  return (
    <CartItemStyles personalized={props.item.personalizationAddons.length > 0}>
      {props.item.personalizationAddons.length > 0 ? (
        <div className="personalized-label">
          <span>Personalized item</span>
        </div>
      ) : null}
      <div className="item-grid">
        <div className="item-image">
          <Link
            href={`/store/${props.storeId}/${
              props.isDemo ? 'demo/' : ''
            }product?productId=${props.item.sku.storeProductId}&colorId=${
              props.item.sku.color.id
            }`}
          >
            <a>
              <img
                src={props.item.image}
                alt={`${props.item.sku.color.label} ${props.item.name}`}
              />
            </a>
          </Link>
        </div>
        <div className="item-details">
          <h3 className="primary">
            <Link
              href={`/store/${props.storeId}/${
                props.isDemo ? 'demo/' : ''
              }product?productId=${props.item.sku.storeProductId}&colorId=${
                props.item.sku.color.id
              }`}
            >
              <a>{props.item.name}</a>
            </Link>
          </h3>
          <div className="secondary-details">
            <p className="secondary">
              <span className="label">Color:</span>
              {props.item.sku.color.label}
            </p>
            {props.item.personalizationAddons.length > 0 ? (
              <div className="personalization">
                <div className="addon-label">Addons:</div>
                <div className="addon-items">
                  {props.item.personalizationAddons.map(item => (
                    <div key={item.id} className="addon-item">
                      {item.value}
                      {item.subItems.length > 0
                        ? item.subItems.map(subItem => (
                            <div key={subItem.id} className="subitem">
                              {subItem.value}
                            </div>
                          ))
                        : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
        <div className="total">{formatToMoney(props.item.itemTotal!)}</div>
        <div className="inputs">
          <div className="size">
            <label htmlFor="size">Size</label>
            <select
              name="size"
              id="size"
              value={props.item.sku.id}
              onChange={cartItem.handleSizeChange}
            >
              {props.skus.map(sku => {
                if (sku.color.id === props.item.sku.color.id) {
                  return (
                    <option
                      key={sku.size.id}
                      value={sku.id}
                      disabled={cartItem.isSizeOutOfStock(items, sku)}
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
              value={cartItem.quantity}
              onChange={cartItem.handleQuantityChange}
              disabled={
                props.isTeacherAppreciationStore && props.item.itemTotal === 0
              }
            >
              {[...Array(11)].map((_v, i) => {
                if (i === 0) return;
                return (
                  <option
                    key={i}
                    value={`${i}`}
                    disabled={cartItem.isOptionDisabled(items, props.item, i)}
                  >
                    {i}
                  </option>
                );
              })}
            </select>
          </div>
        </div>
        <div className="remove-button">
          <button type="button" onClick={() => removeItem(props.item.id)}>
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
        {renderTeacherAppreciation && (
          <div className="teacher-appreciation">
            <CheckCircleIcon className="check-circle-icon" />
            Free Teacher Appreciation Item
          </div>
        )}
      </div>
    </CartItemStyles>
  );
}

const CartItemStyles = styled.div<{ personalized: boolean }>`
  padding: ${props => (props.personalized ? '1.75rem 0 2.5rem' : '2.5rem 0')};
  border-top: 1px solid #d1d5db;

  &:last-of-type {
    border-bottom: 1px solid #d1d5db;
  }

  .item-grid {
    display: grid;
    grid-template-areas:
      'image details total'
      'image inputs button'
      'space teacherAppreciation teacherAppreciation';
    grid-template-columns: 8rem 1fr 10rem;
    gap: 0 1.5rem;
  }

  .teacher-appreciation {
    margin: 1.25rem 0 0;
    grid-area: teacherAppreciation;
    font-size: 0.875rem;
    display: flex;
    align-items: center;
    color: #1f2937;
    font-weight: 500;

    .check-circle-icon {
      margin-right: 0.375rem;
      height: 1.0625rem;
      width: 1.0625rem;
      color: #047857;
    }
  }

  .personalized-label {
    position: relative;
    padding: 0 0 1.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    color: #b91c1c;
    text-transform: uppercase;
    letter-spacing: 0.075em;
    text-align: center;

    span {
      padding: 0 1rem;
      position: relative;
      z-index: 100;
    }
  }

  .item-image {
    grid-area: image;
    display: flex;

    a {
      padding: 0.5rem 0.75rem;
      width: 7.5rem;
      display: flex;
      align-items: center;
      background-color: #fff;
      border-radius: 0.25rem;
      border: 1px solid #d1d5db;
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
    color: #111827;

    .label {
      width: 4.25rem;
      color: #6e788c;
    }
  }

  .personalization {
    display: flex;

    .addon-label {
      width: 4.25rem;
      font-size: 0.9375rem;
      font-weight: 400;
      color: #6e788c;
    }

    .addon-item {
      margin: 0.375rem 0 0;
      font-size: 0.9375rem;
      font-weight: 400;
      color: #111827;

      &:first-of-type {
        margin: 0;
      }

      .subitem {
        margin: 0.375rem 0 0;
      }
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

    select:disabled {
      cursor: default;
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
        color: #4b5563;
      }

      svg {
        height: 1.125rem;
        width: 1.125rem;
        color: #6b7280;
      }
    }
  }

  .remove-button:hover {
    color: #4b5563;
  }

  @media (max-width: 700px) {
    margin: 0 auto;

    .item-grid {
      width: 100%;
      grid-template-areas:
        'image details total'
        'image inputs inputs'
        'teacherAppreciation teacherAppreciation teacherAppreciation'
        'button button button';
      grid-template-columns: 5rem 1fr 3rem;
      gap: 0 1rem;
    }

    .teacher-appreciation {
      justify-content: center;
    }

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
        border: 1px solid #c6cbd2;

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
