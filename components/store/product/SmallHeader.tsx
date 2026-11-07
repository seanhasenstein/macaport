import { ProductSize } from 'interfaces';
import styled from 'styled-components';
import ProductPrice from './ProductPrice';

type Props = {
  productName: string;
  productSizes: ProductSize[];
  size: ProductSize;
  personalizationTotal: number;
  eligibleForFreeShirt: boolean;
};

export default function SmallHeader(props: Props) {
  const base =
    props.size.label === 'DEFAULT'
      ? props.productSizes[0].price
      : props.size.price;
  const full = base + props.personalizationTotal;
  // A free item covers the garment only, so add-ons are still payable.
  const payable = props.eligibleForFreeShirt
    ? props.personalizationTotal
    : full;

  return (
    <SmallHeaderStyles>
      <h2 className="name">{props.productName}</h2>
      <h3 className="price">
        <ProductPrice full={full} payable={payable} />
      </h3>
    </SmallHeaderStyles>
  );
}

const SmallHeaderStyles = styled.div`
  display: none;

  @media (max-width: 767px) {
    margin: 0 0 2rem;
    display: flex;
    justify-content: space-between;

    .name {
      margin: 0 1.5rem 0 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;
    }

    .price {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
      color: #111827;

      .was {
        margin-right: 0.375rem;
        font-weight: 400;
        color: #9ca3af;
        text-decoration: line-through;
      }

      .free {
        color: #047857;
      }
    }
  }
`;
