import styled from 'styled-components';
import HeadingTitle from './HeadingTitle';

type Props = {
  details: string[] | undefined;
};

export default function ProductDetails(props: Props) {
  return (
    <ProductDetailsStyles>
      {props.details && props.details.length > 0 && (
        <div className="details">
          <HeadingTitle>Details</HeadingTitle>
          <ul>
            {props.details.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}
    </ProductDetailsStyles>
  );
}

const ProductDetailsStyles = styled.div`
  .details {
    padding: 1.875rem 0;

    ul {
      margin: 0;
      padding: 0 0 0 1.125rem;
    }

    li {
      margin: 0 0 0.5rem;
      color: #4b5563;

      &:last-of-type {
        margin: 0;
      }
    }
  }
`;
