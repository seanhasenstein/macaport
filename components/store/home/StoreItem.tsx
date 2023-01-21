import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { StoreProduct } from '../../../interfaces';

import { formatToMoney } from '../../../utils';

type Props = {
  item: StoreProduct;
  storeId: string;
  isDemo: boolean;
};

export default function StoreItem(props: Props) {
  return (
    <Link
      href={`/store/${props.storeId}/${
        props.isDemo ? 'demo/' : ''
      }product?productId=${props.item.id}&colorId=${props.item.colors[0].id}`}
      passHref
    >
      <StoreItemStyles>
        <div className="img-wrapper">
          <img
            src={props.item.colors[0].primaryImage}
            alt={`${props.item.colors[0].label} ${props.item.name}`}
          />
        </div>
        <div className="details">
          <h3 className="primary">{props.item.name}</h3>
          <h4 className="secondary">{props.item.tag}</h4>
          <div className="bottom-row">
            <h4 className="price">
              {formatToMoney(props.item.sizes[0].price)}
            </h4>
            <div className="colors">
              {props.item.colors.map(color => (
                <Color key={color.id} hex={color.hex} title={color.label}>
                  <span className="sr-only">{color.label}</span>
                </Color>
              ))}
            </div>
          </div>
        </div>
      </StoreItemStyles>
    </Link>
  );
}

const StoreItemStyles = styled.a`
  flex-shrink: 0;
  max-width: 22rem;
  width: 100%;
  padding: 0 1rem 0.875rem 1rem;
  position: relative;
  background-color: #fff;
  border-radius: 0.25rem;
  border: 1px solid #e5e7eb;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;

  &:hover {
    border-color: #dadde2;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.075) 0px 2px 3px 0px;

    .img-wrapper img {
      transform: scale(1.1);
    }
  }

  .img-wrapper {
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
    border-bottom: 1px solid #e5e7eb;
    border-radius: 0.25rem 0.25rem 0 0;

    img {
      max-width: 11rem;
      width: 100%;
      height: 14rem;
      object-fit: contain;
      transition: transform 250ms ease-in-out;
    }
  }

  .details {
    padding: 0.875rem 0 3.5rem;
  }

  .primary,
  .secondary {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .primary {
    margin: 0 0 0.125rem;
    font-weight: 600;
    color: #36383e;
    line-height: 1.25;
  }

  .secondary {
    margin: 0;
    color: #7f8694;
  }

  .bottom-row {
    position: absolute;
    bottom: 0.875rem;
    left: 1rem;
    right: 1rem;
    display: flex;
    justify-content: space-between;
  }

  .price {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #36383e;
  }

  .colors {
    display: flex;
    gap: 0.375rem;
  }
`;

const Color = styled.div<{ hex: string }>`
  height: 1.125rem;
  width: 1.125rem;
  background-color: ${props => props.hex};
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 9999px;
`;
