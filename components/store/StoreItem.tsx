import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import { Item, Color as ColorInterface } from '../../interfaces';
import { formatToMoney } from '../../utils';

type Props = {
  item: Item;
  storeId: string;
};

const ColorStyles = styled.div`
  margin: 0 0 0 0.375rem;
  background-color: ${(props: ColorProps) => props.colorObj.hex};
  height: 0.875rem;
  width: 0.875rem;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
  border-radius: 9999px;
`;

type ColorProps = {
  colorObj: ColorInterface;
  setActiveColor: (c: ColorInterface) => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
};

function Color(props: ColorProps) {
  return (
    <ColorStyles
      {...props}
      title={props.colorObj.label}
      onMouseEnter={() => props.setActiveColor(props.colorObj)}
    >
      <span className="sr-only">{props.colorObj.label}</span>
    </ColorStyles>
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

  &:hover .img-wrapper img {
    transform: scale(1.04);
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
    padding: 0.875rem 0 2.75rem;
  }

  .primary,
  .secondary {
    font-size: 0.875rem;
    font-weight: 500;
    line-height: 1.5;
  }

  .primary {
    margin: 0 0 0.125rem;
    color: #36383e;
    line-height: 1.25;
  }

  .secondary {
    margin: 0;
    color: #9e9eac;
  }

  .price {
    margin: 0;
    font-size: 0.875rem;
    font-weight: 600;
    color: #36383e;
    position: absolute;
    bottom: 0.75rem;
    left: 1rem;
  }

  .colors {
    display: flex;
    position: absolute;
    bottom: 0.875rem;
    right: 1rem;
  }
`;

export default function StoreItem({ item, storeId }: Props) {
  const [activeColor, setActiveColor] = React.useState(item.colors[0]);

  return (
    <Link
      href={`/store/${storeId}/product?productId=${item.id}&color=${activeColor.label}`}
      passHref
    >
      <StoreItemStyles>
        <div className="img-wrapper">
          <img
            src={activeColor.primaryImage}
            alt={`${activeColor.label} ${item.name}`}
          />
        </div>
        <div className="details">
          <h3 className="primary">{item.name}</h3>
          <h4 className="secondary">{item.tag}</h4>
          <h4 className="price">{formatToMoney(item.sizes[0].price)}</h4>
          <div className="colors">
            {item.colors.map(c => (
              <Color key={c.id} colorObj={c} setActiveColor={setActiveColor} />
            ))}
          </div>
        </div>
      </StoreItemStyles>
    </Link>
  );
}
