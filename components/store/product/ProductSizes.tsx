import React from 'react';
import styled from 'styled-components';

import SizeChartModal from 'components/modals/SizeChartModal';

import { isOutOfStock } from 'utils';

import {
  CartItem,
  ProductColor,
  ProductSize,
  ProductSku,
  SizeChart,
} from 'interfaces';

type Props = {
  cartItems: CartItem[];
  productSkus: ProductSku[];
  color: ProductColor;
  size: ProductSize;
  colorOutOfStock: boolean;
  lowInventory: boolean;
  handleSizeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  hasMounted: boolean;
  productName: string;
  productPrimaryImage: string | undefined;
  productSizes: ProductSize[];
  sizeChart: SizeChart | undefined;
};

export default function ProductSizes(props: Props) {
  const [sizeChartModalIsOpen, setIsSizeChartModalOpen] = React.useState(false);

  const openSizeChartModal = () => {
    setIsSizeChartModalOpen(true);
  };

  const closeSizeChartModal = () => {
    setIsSizeChartModalOpen(false);
  };

  return (
    <ProductSizesStyles>
      {props.colorOutOfStock && (
        <div className="color-out-of-stock">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
          This color is currently sold out.
        </div>
      )}
      {props.lowInventory && (
        <div className="few-left-instock">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
              clipRule="evenodd"
            />
          </svg>
          <p>Hurry! Only a few left.</p>
        </div>
      )}
      <div className="sizes-header">
        <h3 className="custom-size-title">Sizes</h3>
        {props.sizeChart?.length ? (
          <button
            type="button"
            className="size-chart-button"
            onClick={openSizeChartModal}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="ruler-icon"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M22.5 7.5h-21v9h21v-9Zm-20 8v-7H5v4h1v-4h2.25v3h1v-3h2.25v4h1v-4h2.25v3h1v-3H18v4h1v-4h2.5v7h-19Z"
                fill="currentColor"
              ></path>
            </svg>
            Size chart
          </button>
        ) : null}
      </div>
      {props.hasMounted && (
        <div className="grid">
          {props.productSkus.map(sku => {
            if (sku.color.id === props.color.id) {
              return (
                <div
                  key={sku.size.id}
                  className={`size ${
                    props.size.label === sku.size.label ? 'checked' : ''
                  }`}
                >
                  <input
                    type="radio"
                    value={sku.size.label}
                    checked={props.size.label === sku.size.label}
                    disabled={isOutOfStock(sku, props.cartItems)}
                    onChange={props.handleSizeChange}
                    name="size"
                    id={sku.size.label}
                    className="size-input"
                  />
                  <label
                    htmlFor={sku.size.label}
                    className={
                      isOutOfStock(sku, props.cartItems) ? 'out-of-stock' : ''
                    }
                  >
                    {sku.size.label}
                  </label>
                </div>
              );
            }
          })}
        </div>
      )}
      <SizeChartModal
        isOpen={sizeChartModalIsOpen}
        closeModal={closeSizeChartModal}
        sizeChart={props.sizeChart}
        productSizes={props.productSizes}
        productName={props.productName}
        productPrimaryImage={props.productPrimaryImage}
      />
    </ProductSizesStyles>
  );
}

const ProductSizesStyles = styled.div`
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(4rem, 1fr));
    gap: 0.875rem;
  }

  .sizes-header {
    margin: 0 0 1.125rem;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .custom-size-title {
      margin: 0;
      font-weight: 500;
      font-size: 1rem;
      color: #111827;
      line-height: 100%;
    }

    .size-chart-button {
      margin: 0;
      padding: 0.5rem 0 0.5rem 0.5rem;
      display: flex;
      align-items: center;
      gap: 0 0.5rem;
      background-color: transparent;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      color: #1f2937;
      text-decoration: underline;
      line-height: 100%;
      cursor: pointer;
      &:hover {
        color: #000;
      }
      .ruler-icon {
        margin-top: 0.0625rem;
        vertical-align: middle;
      }
    }
  }

  .size {
    margin: 0;
    position: relative;

    label {
      position: relative;
      margin: 0;
      padding: 0.625rem 1rem;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid #d1d5db;
      border-radius: 0.25rem;
      font-size: 0.9375rem;
      letter-spacing: 0.0375em;
      color: #111827;
      cursor: pointer;
      text-align: center;

      &.out-of-stock {
        color: #c7cbd2;
        cursor: default;
      }

      &:hover:not(.out-of-stock) {
        border-color: #9199a6;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.075),
          0 1px 2px -1px rgb(0 0 0 / 0.075);
      }
    }

    &.checked label,
    &.checked label:hover {
      background-color: #282d34;
      border-color: #282d34;
      color: #fff;
    }

    .size-input {
      margin: 0;
      padding: 0;
      height: 1px;
      width: 1px;
      position: absolute;
      top: 0;
      left: 0;
      background-color: transparent;
      border: none;
      box-shadow: none;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible + label {
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #1f30c2 0px 0px 0px 4px,
          rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }
  }

  .color-out-of-stock {
    margin: 0 0 1.75rem;
    display: inline-flex;
    align-items: center;
    gap: 0.4375rem;

    svg {
      flex-shrink: 0;
      height: 1.25rem;
      width: 1.25rem;
      color: #be123c;
    }

    p {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      color: #111827;
      line-height: 1.25;
    }
  }

  .few-left-instock {
    margin: 0 0 1.75rem;
    display: inline-flex;
    gap: 0.4375rem;

    svg {
      flex-shrink: 0;
      height: 1.25rem;
      width: 1.25rem;
      color: #c2410c;
    }

    p {
      margin: 0;
      font-size: 1rem;
      font-weight: 500;
      color: #111827;
      line-height: 1.25;
    }
  }
`;
