import styled from 'styled-components';
import { ProductColor } from 'interfaces';
import { checkHexColor } from 'utils';

type ColorProps = {
  id: string;
  label: string;
  hex: string;
  activeColor: ProductColor;
  handleColorChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function Color(props: ColorProps) {
  return (
    <ColorStyles {...props} title={props.label}>
      <input
        type="radio"
        name="color"
        id={props.hex}
        value={props.id}
        onChange={props.handleColorChange}
        checked={props.id === props.activeColor.id}
      />
      <div
        className={`label-wrapper ${
          props.id === props.activeColor.id ? 'checked' : ''
        }`}
      >
        <label htmlFor={props.hex}>
          <span className="sr-only">{props.label}</span>
        </label>
      </div>
    </ColorStyles>
  );
}

const ColorStyles = styled.div`
  position: relative;

  .label-wrapper {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 9999px;

    &.checked {
      padding: 0.125rem;
      border: 2px solid
        ${(color: ColorProps) => {
          const isTooLight = checkHexColor(color.hex);
          if (isTooLight) return '#6b7280';
          return color.hex;
        }};
    }

    label {
      display: flex;
      height: 100%;
      width: 100%;
      border-radius: 9999px;
      background-color: ${(color: ColorProps) => color.hex};
      border: 1px solid rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }
  }

  input[type='radio'] {
    margin: 0;
    padding: 0;
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    background-color: transparent;
    border: none;
    box-shadow: none;
    z-index: -1;

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: none;
    }

    &:focus-visible + .label-wrapper {
      border-color: #1f30c2;
    }

    &:checked {
      background-image: none;
      color: transparent;
    }
  }
`;
