import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { formatToMoney } from '../../utils';
import { Item, Size } from '../../interfaces';
import Button from './Button';

const ProductSidebarStyles = styled.div`
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
    background-color: #fcfcfd;
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
    margin: 0 2rem;
    padding: 1.5rem 0;
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
    color: #2d9542;
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
    cursor: pointer;
  }

  .close-button:hover {
    color: #000;
  }

  .close-button svg {
    height: 1.25rem;
    width: 1.25rem;
  }

  .main {
    margin: 0.25rem 0;
    padding: 0 2rem;
  }

  .item {
    padding: 1.5rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 0.375rem;
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

  .item-details {
    margin: 1.25rem 0 0.5rem;
    width: 100%;
    text-align: center;
  }

  .item-size,
  .item-price {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .item-size {
    color: #6b7280;
  }

  .item-price {
    color: #059669;
  }

  .actions {
    margin: 1.75rem 0 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 1rem;
  }

  .store-home-link {
    margin: 1rem 0 0;
    font-size: 0.9375rem;
    text-align: center;

    a {
      color: #3b4a58;
      text-decoration: underline;

      &:hover {
        color: #000;
      }
    }
  }

  @media (max-width: 500px) {
    .sidebar {
      max-width: calc(100% - 2.5rem);
    }
  }
`;

type Props = {
  storeSlug: string;
  item: Item;
  color: string;
  size?: Size;
  image: string | undefined;
  isSidebarOpen: boolean;
  closeSidebar: () => void;
};

export default function ProductSidebar({
  storeSlug,
  item,
  color,
  size,
  image,
  isSidebarOpen,
  closeSidebar,
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const closeButton = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    const handleEscapeKeyup = (e: KeyboardEvent) => {
      if (e.code === 'Escape') closeSidebar();
    };

    const handleOutsideClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        closeSidebar();
    };

    if (isSidebarOpen) {
      closeButton?.current && closeButton.current.focus();
      document.addEventListener('keyup', handleEscapeKeyup);
      document.addEventListener('click', handleOutsideClick);

      const timeout = setTimeout(() => {
        closeSidebar();
      }, 5000);

      return () => {
        document.removeEventListener('keyup', handleEscapeKeyup);
        document.removeEventListener('click', handleOutsideClick);
        clearTimeout(timeout);
      };
    }
  }, [closeSidebar, isSidebarOpen]);

  if (!size) {
    // todo: figure out best way to handle this situation (if no size is passed to productSidebar)
    return null;
  }

  return (
    <ProductSidebarStyles>
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
              onClick={() => closeSidebar()}
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
                <img src={image} alt={`${color} ${item.name}`} />
              </div>
              <div className="item-details">
                <h3 className="item-name">{item.name}</h3>
                <p className="item-size">
                  Color: {color} | Size: {size.label}
                </p>
                <p className="item-price">{formatToMoney(size.price, true)}</p>
              </div>
            </div>
            <div className="actions">
              <Button as="a" href={`/store/${storeSlug}/cart`} color="white">
                View Cart
              </Button>
              <Button
                as="a"
                href={`/store/${storeSlug}/checkout`}
                color="black"
              >
                Checkout
              </Button>
            </div>
            <div className="store-home-link">
              <Link href={`/store/${storeSlug}`}>
                <a>Back to store home</a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProductSidebarStyles>
  );
}
