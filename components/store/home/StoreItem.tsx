import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

import { ProductColor, StoreProduct } from '../../../interfaces';

import { formatToMoney } from '../../../utils';

type Props = {
  item: StoreProduct;
  storeId: string;
  isDemo: boolean;
  eligibleForFreeItem?: boolean;
};

export default function StoreItem(props: Props) {
  const totalColors = props.item.colors.length;
  const colorsToShow = 5;

  const [activeColor, setActiveColor] = React.useState(props.item.colors[0]);

  return (
    <Link
      href={`/store/${props.storeId}/${
        props.isDemo ? 'demo/' : ''
      }product?productId=${props.item.id}&colorId=${activeColor.id}`}
      passHref
    >
      <StoreItemStyles>
        <div className="img-wrapper">
          <img
            src={activeColor.primaryImage}
            alt={`${activeColor.label} ${props.item.name}`}
          />
        </div>
        <div className="details">
          <h3 className="primary">{props.item.name}</h3>
          <h4 className="secondary">{props.item.tag}</h4>
          <div className="bottom-row">
            <h4 className="price">
              {props.eligibleForFreeItem
                ? formatToMoney(0)
                : formatToMoney(props.item.sizes[0].price)}
            </h4>
            <div className="colors-row">
              <div className="colors">
                {props.item.colors.map((color, index) => {
                  if (index < colorsToShow) {
                    return (
                      <Color
                        key={color.id}
                        color={color}
                        setActiveColor={setActiveColor}
                      />
                    );
                  }
                })}
              </div>
              {totalColors > colorsToShow ? (
                <p className="more-colors">+{totalColors - colorsToShow}</p>
              ) : null}
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
  border-radius: 0.1875rem;
  border: 1px solid #d1d5db;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

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

  .colors-row {
    display: flex;
    gap: 0 0.375rem;
  }

  .colors {
    display: flex;
    gap: 0.28125rem;
  }

  .more-colors {
    padding: 0;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;

type ColorProps = {
  color: ProductColor;
  setActiveColor: (c: ProductColor) => void;
};

function Color(props: ColorProps) {
  return (
    <ColorStyles
      hex={props.color.hex}
      title={props.color.label}
      onMouseEnter={() => props.setActiveColor(props.color)}
    >
      <span className="sr-only">{props.color.label}</span>
    </ColorStyles>
  );
}

const ColorStyles = styled.div<{ hex: string }>`
  height: 1.125rem;
  width: 1.125rem;
  background-color: ${props => props.hex};
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-radius: 9999px;
`;
