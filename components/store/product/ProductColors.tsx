import styled from 'styled-components';
import { ProductColor } from 'interfaces';
import HeadingTitle from './HeadingTitle';
import Color from './ProductColor';

type Props = {
  productColors: ProductColor[];
  color: ProductColor;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function ProductColors(props: Props) {
  return (
    <ProductColorsStyles>
      <HeadingTitle>Colors</HeadingTitle>
      <div className="grid">
        {props.productColors.map(c => (
          <Color
            key={c.id}
            id={c.id}
            hex={c.hex}
            label={c.label}
            activeColor={props.color}
            handleColorChange={props.handleColorChange}
          />
        ))}
      </div>
    </ProductColorsStyles>
  );
}

const ProductColorsStyles = styled.div`
  .grid {
    display: flex;
    gap: 0.625rem;
    flex-wrap: wrap;
    width: 100%;
    list-style-type: none;
  }
`;
