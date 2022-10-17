import styled from 'styled-components';
import HeadingTitle from './HeadingTitle';

type Props = {
  description: string | undefined;
};

export default function ProductDescription(props: Props) {
  return (
    <ProductDescriptionStyles>
      {props.description && (
        <div className="description">
          <HeadingTitle>Description</HeadingTitle>
          <p>{props.description}</p>
        </div>
      )}
    </ProductDescriptionStyles>
  );
}

const ProductDescriptionStyles = styled.div`
  .description {
    padding: 1.875rem 0;
    border-top: 1px solid #dcdfe4;
    border-bottom: 1px solid #dcdfe4;

    p {
      margin: 0;
      line-height: 1.5;
      color: #4b5563;
    }
  }
`;
