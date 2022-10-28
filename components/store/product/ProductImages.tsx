import { ProductColor } from 'interfaces';
import styled from 'styled-components';

type Props = {
  productName: string;
  primaryImage: string | undefined;
  secondaryImages: string[] | undefined;
  handleImageClick: (imageIndex: string) => void;
  color: ProductColor;
};

export default function ProductImages(props: Props) {
  return (
    <ProductImagesStyles>
      <button
        className="primary-img-button"
        onClick={() => props.handleImageClick('image-0')}
      >
        <img
          src={props.primaryImage}
          alt={`${props.color.label} ${props.productName}`}
          className="primary-img"
        />
      </button>
      {props.secondaryImages && props.secondaryImages.length > 0 && (
        <div className="secondary-img-container">
          {props.secondaryImages &&
            props.secondaryImages.map((secImg, index) => (
              <button
                key={index}
                onClick={() => props.handleImageClick(`image-${index + 1}`)}
                className="secondary-img-button"
              >
                <img
                  src={secImg}
                  alt={`${props.color.label} ${props.productName} ${index + 2}`}
                  className="secondary-img"
                />
              </button>
            ))}
        </div>
      )}
    </ProductImagesStyles>
  );
}

const ProductImagesStyles = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .primary-img-button {
    padding: 3rem 2rem;
    width: 100%;
    background-color: #fff;
    text-align: center;
    border: 1px solid #dcdfe4;
    border-radius: 0.1875rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;
  }

  .primary-img {
    max-width: 24rem;
    width: 100%;
  }

  .secondary-img-container {
    margin: 1rem 0;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(6rem, 1fr));
    gap: 1rem;
    width: 100%;
  }

  .secondary-img-button {
    padding: 1.5rem;
    background-color: #fff;
    border: 1px solid #dcdfe4;
    border-radius: 0.1875rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;
  }

  .secondary-img {
    width: 100%;
  }

  @media (max-width: 767px) {
    margin: 0 0 2rem;
    align-items: flex-start;
    gap: 0.75rem;

    .primary-img-button {
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .secondary-img-container {
      margin: 0;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.75rem;
    }

    .secondary-img-button {
      padding: 1rem;
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
`;
