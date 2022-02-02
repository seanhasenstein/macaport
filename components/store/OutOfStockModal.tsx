import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styled from 'styled-components';
import useEscapeKeydownClose from '../../hooks/useEscapeKeydownClose';
import useOutsideClick from '../../hooks/useOutsideClick';
import { CartItem } from '../../interfaces';
import OutOfStockItem from './OutOfStockItem';

type Props = {
  verifiedItems: CartItem[];
  lowerInventoryItems: CartItem[];
  outOfStockItems: CartItem[];
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function OutOfStockModal({
  verifiedItems,
  lowerInventoryItems,
  outOfStockItems,
  showModal,
  setShowModal,
}: Props) {
  const router = useRouter();
  const modalRef = React.useRef<HTMLDivElement>(null);
  useEscapeKeydownClose(showModal, setShowModal);
  useOutsideClick(showModal, setShowModal, modalRef);

  return (
    <OutOfStockModalStyles>
      {showModal && (
        <div className="modal-background">
          <div ref={modalRef} className="modal">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="close-button"
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
              <span className="sr-only">Close Modal</span>
            </button>
            <div className="heading">
              <h3>
                Insufficient inventory for cart item
                {lowerInventoryItems.length > 1 ||
                outOfStockItems.length > 1 ||
                (lowerInventoryItems.length > 0 && outOfStockItems.length > 0)
                  ? 's'
                  : ''}
              </h3>
              <p>
                We were unable to place your order due to insufficient inventory
                for{' '}
                {lowerInventoryItems.length > 1 ||
                outOfStockItems.length > 1 ||
                (lowerInventoryItems.length > 0 && outOfStockItems.length > 0)
                  ? ''
                  : 'an'}{' '}
                item
                {lowerInventoryItems.length > 1 ||
                outOfStockItems.length > 1 ||
                (lowerInventoryItems.length > 0 && outOfStockItems.length > 0)
                  ? 's'
                  : ''}{' '}
                in your cart. The following changes have been made to your cart.
              </p>
            </div>
            <div>
              {lowerInventoryItems.length > 0 && (
                <div className="section">
                  <h4>Insufficient inventory (quantity updated in cart):</h4>
                  {lowerInventoryItems.map(item => (
                    <OutOfStockItem key={item.id} item={item} />
                  ))}
                </div>
              )}
              {outOfStockItems.length > 0 && (
                <div className="section">
                  <h4>Out of stock (removed from cart):</h4>
                  {outOfStockItems.map(item => (
                    <OutOfStockItem key={item.id} item={item} />
                  ))}
                </div>
              )}
            </div>
            <div className="footer">
              <p>
                {verifiedItems.length > 0 || lowerInventoryItems.length > 0
                  ? 'Review your order and submit again. '
                  : ''}
                If you have any questions contact us at{' '}
                <a href="mailto:support@macaport.com?subject=Low inventory/out of stock inquiry">
                  support@macaport.com
                </a>
                .
              </p>
              <div className="actions">
                {verifiedItems.length > 0 || lowerInventoryItems.length > 0 ? (
                  <Link href={`/store/${router.query.id}/cart`}>
                    Back to your cart
                  </Link>
                ) : (
                  <Link href={`/store/${router.query.id}`}>
                    Back to store home
                  </Link>
                )}
                <button type="button" onClick={() => setShowModal(false)}>
                  Back to checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </OutOfStockModalStyles>
  );
}

const OutOfStockModalStyles = styled.div`
  .modal-background {
    padding: 1.5rem;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    min-height: 100%;
    background-color: rgba(209, 213, 219, 0.7);
    z-index: 9999;
  }

  .modal {
    margin: 4rem auto 0;
    padding: 2.5rem 3rem;
    max-width: 40rem;
    width: 100%;
    background-color: #fff;
    border-radius: 0.375rem;
    filter: drop-shadow(0 1px 2px rgb(0 0 0 / 0.1))
      drop-shadow(0 1px 1px rgb(0 0 0 / 0.06));

    h3 {
      margin: 0 0 0.875rem;
      font-size: 1.25rem;
      font-weight: 700;
      color: #111827;
    }

    h4 {
      margin: 0 0 0.75rem;
      font-size: 0.8125rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.025em;
      color: #111827;
    }

    p {
      margin: 0;
      font-size: 1rem;
      color: #4b5563;
      line-height: 1.5;

      a {
        color: #4338ca;
        text-decoration: underline;
      }
    }
  }

  .close-button {
    padding: 0.25rem;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    border-radius: 0.3125rem;
    color: #6b7280;
    cursor: pointer;

    svg {
      height: 1.25rem;
      width: 1.25rem;
    }

    &:hover {
      color: #111827;
    }
  }

  .heading {
    margin: 0 0 2rem;
  }

  .section {
    margin: 0 0 1.75rem;
    border-bottom: 1px solid #e5e7eb;
  }

  .footer {
    margin: 1rem 0 0;
  }

  .actions {
    margin: 2rem 0 0;
    display: flex;
    justify-content: flex-end;
    gap: 1rem;

    a,
    button {
      padding: 0.75rem 1.25rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 0.875rem;
      font-weight: 500;
      letter-spacing: 0.011em;
      border-radius: 0.375rem;
      box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
        rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

      &:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
      }

      &:focus-visible {
        box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #1f30c2 0px 0px 0px 4px,
          rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }

    a {
      color: #111827;
      border: 1px solid #d1d5db;

      &:hover {
        background-color: #f9fafb;
      }
    }

    button {
      background-color: #282d34;
      color: #fff;
      border: 1px solid #181a1e;
      cursor: pointer;
      transition: all 150ms ease-in-out;

      &:hover {
        background-color: #202329;
        color: rgba(255, 255, 255, 1);
      }
    }
  }

  @media (max-width: 767px) {
    .modal {
      margin: 0 auto;
    }
  }

  @media (max-width: 500px) {
    .modal-background {
      padding: 0.5rem;
    }
    .modal {
      padding: 1.75rem 2rem;
    }

    .close-button {
      display: none;
    }

    .actions {
      flex-direction: column;
    }
  }
`;
