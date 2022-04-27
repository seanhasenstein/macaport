import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { StoreProduct } from '../../interfaces';
import { formatToMoney } from '../../utils';

type Props = {
  item: StoreProduct;
  storeId: string;
};

export default function StoreItem({ item, storeId }: Props) {
  return (
    <Link
      href={`/store/${storeId}/product?productId=${item.id}&colorId=${item.colors[0].id}`}
      passHref
    >
      <StoreItemStyles>
        <div className="img-wrapper">
          <img
            src={item.colors[0].primaryImage}
            alt={`${item.colors[0].label} ${item.name}`}
          />
        </div>
        <div className="details">
          <h3 className="primary">{item.name}</h3>
          <h4 className="secondary">{item.tag}</h4>
          <div className="bottom-row">
            <h4 className="price">{formatToMoney(item.sizes[0].price)}</h4>
            <h4 className="colors">
              {item.colors.length} color{item.colors.length > 1 ? 's' : null}
            </h4>
          </div>
        </div>
      </StoreItemStyles>
    </Link>
  );
}

const StoreItemStyles = styled.a`
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
      transform: scale(1.04);
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
      height: 100%;
      transition: transform 150ms ease-in-out;
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

  .price,
  .colors {
    margin: 0;
    font-size: 0.875rem;
  }

  .price {
    font-weight: 600;
    color: #36383e;
  }

  .colors {
    font-weight: 500;
    color: #7f8694;
  }
`;
