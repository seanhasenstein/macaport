import { ProductSize } from 'interfaces';
import styled from 'styled-components';
import { formatToMoney } from 'utils';

type Props = {
  productName: string;
  productSizes: ProductSize[];
  size: ProductSize;
  personalizationTotal: number;
};

export default function LargeHeader(props: Props) {
  return (
    <LargeHeaderStyles>
      <h2 className="name">{props.productName}</h2>
      <h3 className="price">
        {formatToMoney(
          (props.size.label === 'DEFAULT'
            ? props.productSizes[0].price
            : props.size.price) + props.personalizationTotal
        )}
      </h3>
    </LargeHeaderStyles>
  );
}

const LargeHeaderStyles = styled.div`
  margin: 0 0 3rem;
  display: flex;
  justify-content: space-between;

  .name {
    margin: 0 1.5rem 0 0;
    font-size: 1.25rem;
    font-weight: 500;
    color: #111827;
  }

  .price {
    margin: 0;
    font-size: 1.125rem;
    font-weight: 600;
    color: #111827;
  }

  @media (max-width: 767px) {
    display: none;
  }
`;
