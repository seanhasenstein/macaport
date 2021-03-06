import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { formatToMoney } from '../../utils';
import {
  StoreProduct,
  ProductSize,
  ProductColor,
  PersonalizationAddon,
} from '../../interfaces';
import LinkButton from './LinkButton';

type Props = {
  storeId: string;
  item: StoreProduct;
  color: ProductColor;
  size: ProductSize;
  image: string | undefined;
  personalization: {
    addonItems: PersonalizationAddon[];
    total: number;
  };
  resetProduct: () => void;
  isSidebarOpen: boolean;
};

export default function ProductSidebar({
  storeId,
  item,
  color,
  size,
  image,
  personalization,
  resetProduct,
  isSidebarOpen,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const closeButton = React.useRef<HTMLButtonElement>(null);
  const itemPrice =
    size.price +
    (personalization.addonItems.length > 0 ? personalization.total : 0);

  React.useEffect(() => {
    const handleEscapeKeyup = (e: KeyboardEvent) => {
      if (e.code === 'Escape') {
        resetProduct();
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        resetProduct();
    };

    if (isSidebarOpen) {
      closeButton?.current && closeButton.current.focus();
      document.addEventListener('keyup', handleEscapeKeyup);
      document.addEventListener('click', handleOutsideClick);

      const timeout = setTimeout(() => {
        resetProduct();
      }, 5000);

      return () => {
        document.removeEventListener('keyup', handleEscapeKeyup);
        document.removeEventListener('click', handleOutsideClick);
        clearTimeout(timeout);
      };
    }
  }, [isSidebarOpen, resetProduct]);

  return (
    <ProductSidebarStyles hasAddons={personalization.addonItems.length > 0}>
      <div className={isSidebarOpen ? 'fullscreen' : ''}>
        <div className={`sidebar ${isSidebarOpen ? 'show' : 'hide'}`} ref={ref}>
          <div className="heading">
            <div className="title">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="check-icon"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <h2>Added to Order</h2>
            </div>
            <button
              ref={closeButton}
              aria-label="Close panel"
              className="close-button"
              onClick={resetProduct}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="main">
            <div className="item">
              <div className="item-img">
                <img src={image} alt={`${color.label} ${item.name}`} />
              </div>
              <div>
                <h3 className="item-name">{item.name}</h3>
                <div className="item-specs">
                  <div>
                    <span>Color:</span> {color.label}
                  </div>
                  <div className="size">
                    <span>Size:</span>{' '}
                    {size.label !== 'DEFAULT' ? size.label : ''}
                  </div>
                  {personalization.addonItems.length > 0 ? (
                    <div className="personalization">
                      {personalization.addonItems.map((item, index) => (
                        <div key={item.id} className="addon-item">
                          <span>{index === 0 ? 'Addons:' : null}</span>
                          {item.value}
                          {item.subItems.length > 0 ? (
                            <>
                              {item.subItems.map(subItem => (
                                <div key={subItem.id} className="subitem">
                                  <span></span>
                                  {subItem.value}
                                </div>
                              ))}
                            </>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
                <p className="item-price">{formatToMoney(itemPrice, true)}</p>
              </div>
            </div>
            <div className="actions">
              <Link href={`/store/${storeId}/cart`}>
                <a className="secondary-button">View Cart</a>
              </Link>
              <LinkButton
                href={`/store/${storeId}/checkout`}
                label="Checkout"
              />
            </div>
            <div className="continue-shopping-link">
              <Link href={`/store/${storeId}`}>
                <a>
                  Continue shopping
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
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProductSidebarStyles>
  );
}

const ProductSidebarStyles = styled.div<{ hasAddons: boolean }>`
  .fullscreen {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    max-height: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 10;
  }

  .sidebar {
    max-width: 30rem;
    width: 100%;
    height: 100%;
    visibility: hidden;
    display: flex;
    flex-direction: column;
    position: fixed;
    top: 0;
    bottom: 0;
    right: 0;
    background-color: #f3f4f6;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    transform: translateX(100%);
    transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1),
      visibility 0ms 500ms;
  }

  .sidebar.show {
    transition: transform 500ms cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(0);
    visibility: visible;
  }

  .heading {
    padding: 1.5rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .title {
    display: flex;
  }

  .check-icon {
    margin: 0 0.75rem 0 0;
    height: 1.375rem;
    width: 1.375rem;
    color: #059669;
  }

  h2 {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #36383e;
  }

  .close-button {
    padding: 0;
    height: 1.5rem;
    width: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    color: #6f7b8a;
    border: none;
    border-radius: 0.0625rem;
    cursor: pointer;

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }

    &:hover {
      color: #000;
    }
  }

  .main {
    margin: 0.25rem 0;
    padding: 0 2rem;
  }

  .item {
    position: relative;
    padding: 1.875rem 2rem ${props => (props.hasAddons ? '3.5rem' : '1.875rem')};
    display: grid;
    grid-template-columns: 5rem 1fr;
    gap: 1.75rem;
    background-color: #fff;
    border-radius: 0.25rem;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .item-name {
    margin: 0;
    font-size: 1rem;
    font-weight: 600;
    line-height: 1.2;
    color: #111827;
  }

  .item-img {
    width: 5rem;
  }

  .item-img img {
    width: 100%;
  }

  .item-specs,
  .item-price {
    margin: 0.375rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .item-specs {
    color: #6f7b8a;
    display: flex;
    flex-direction: column;
    gap: 0.375rem;
    text-align: left;

    span {
      display: inline-flex;
      width: 4rem;
    }
  }

  .addon-item {
    margin: 0.375rem 0 0;

    &:first-of-type {
      margin: 0;
    }
  }

  .subitem {
    margin: 0.375rem 0 0;
  }

  .item-price {
    position: absolute;
    bottom: 1.25rem;
    right: 2rem;
    color: #059669;
    font-size: 0.9375rem;
    font-weight: 600;
    text-align: right;
  }

  .actions {
    margin: 1.75rem 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 1rem;
  }

  .secondary-button {
    padding: 0.75rem 1.25rem;
    height: 2.625rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    color: #3a3f4a;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.011em;
    line-height: 1;
    border: 1px solid #d1d5db;
    border-radius: 0.25rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    cursor: pointer;

    &:hover:not(:disabled) {
      border-color: #bbc1ca;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #1f30c2 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .continue-shopping-link {
    margin: 1.25rem 0 0;
    font-size: 0.9375rem;
    font-weight: 500;
    text-align: center;

    a {
      padding: 0.0625rem 0.5rem;
      display: inline-flex;
      align-items: center;
      color: #1f30c2;

      &:hover {
        text-decoration: underline;
      }
    }

    svg {
      margin: 0.25rem 0 0 0.3125rem;
      height: 1.125rem;
      width: 1.125rem;
    }
  }

  @media (max-width: 500px) {
    .sidebar {
      max-width: calc(100% - 2.5rem);
    }

    .heading {
      padding: 1rem;
    }

    .main {
      padding: 0 1rem;
    }

    .item {
      padding: 1.5rem 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      text-align: center;
    }

    .item-img {
      width: 4rem;
    }

    .item-specs {
      margin-top: 0.875rem;
      text-align: center;

      span {
        width: auto;
      }
    }

    .item-price {
      margin: 1rem 0 0;
      position: static;
      text-align: center;
    }
  }
`;
