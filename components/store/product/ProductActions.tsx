import styled from 'styled-components';

type Props = {
  handleAddToOrder: () => void;
  sizeValidationError: string | undefined;
  personalizationValidationError: string | undefined;
};

export default function ProductActions(props: Props) {
  return (
    <ProductActionsStyles>
      <button
        type="button"
        className="add-to-order-button"
        onClick={props.handleAddToOrder}
      >
        Add to order
      </button>
      {props.sizeValidationError && (
        <div className="error">{props.sizeValidationError}</div>
      )}
      {props.personalizationValidationError && (
        <div className="error">{props.personalizationValidationError}</div>
      )}
    </ProductActionsStyles>
  );
}

const ProductActionsStyles = styled.div`
  .add-to-order-button {
    margin: 2rem 0 0;
    padding: 0.75rem 1.25rem;
    width: 100%;
    height: 2.625rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #282d34;
    color: #fff;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.011em;
    border: 1px solid #181a1e;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;
    transition: all 150ms ease-in-out;

    &:hover {
      background-color: #202329;
      color: rgba(255, 255, 255, 1);
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #1f30c2 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.875rem;
    font-weight: 500;
    color: #b91c1c;
  }
`;
