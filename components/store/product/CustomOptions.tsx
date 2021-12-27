import React from 'react';
import styled from 'styled-components';

type Props = {
  className: string;
  includeCustomName: boolean;
  includeCustomNumber: boolean;
  showName: boolean;
  setShowName: React.Dispatch<React.SetStateAction<boolean>>;
  showNumber: boolean;
  setShowNumber: React.Dispatch<React.SetStateAction<boolean>>;
  name: string;
  setName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  number: string;
  setNumber: (e: React.ChangeEvent<HTMLInputElement>) => void;
  nameError: string | undefined;
  numberError: string | undefined;
};

export default function CustomOptions({
  className,
  includeCustomName,
  includeCustomNumber,
  showName,
  setShowName,
  showNumber,
  setShowNumber,
  name,
  setName,
  number,
  setNumber,
  nameError,
  numberError,
}: Props) {
  if (!includeCustomName && !includeCustomNumber) return null;

  return (
    <CustomOptionStyles className={className}>
      <h4>Customizable options</h4>
      <p>Add to the back of your apparel.</p>
      <div className="options">
        {includeCustomName && (
          <div className="option">
            <button
              type="button"
              onClick={() => setShowName(!showName)}
              role="switch"
              aria-checked={showName}
              className={`toggle-button ${showName ? 'on' : 'off'}`}
            >
              <span aria-hidden="true" className="switch" />
              <span className="sr-only">
                Turn {showName ? 'off' : 'on'} custom name option
              </span>
            </button>
            <span className="toggle-description">
              Add a name <span className="light">(+$5.00)</span>
            </span>
          </div>
        )}
        {includeCustomNumber && (
          <div className="option">
            <button
              type="button"
              onClick={() => setShowNumber(!showNumber)}
              role="switch"
              aria-checked={showNumber}
              className={`toggle-button ${showNumber ? 'on' : 'off'}`}
            >
              <span aria-hidden="true" className="switch" />
              <span className="sr-only">
                Turn {showNumber ? 'off' : 'on'} jersey number option
              </span>
            </button>
            <span className="toggle-description">
              Add a jersey number <span className="light">(+$5.00)</span>
            </span>
          </div>
        )}
      </div>
      <div className="values">
        {showName && (
          <div className="item">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={name}
              onChange={e => setName(e)}
            />
            {nameError && <div className="error">{nameError}</div>}
          </div>
        )}
        {showNumber && (
          <div className="item">
            <label htmlFor="number">Number</label>
            <input
              type="text"
              name="number"
              id="number"
              value={number}
              onChange={e => setNumber(e)}
            />
            {numberError && <div className="error">{numberError}</div>}
          </div>
        )}
      </div>
    </CustomOptionStyles>
  );
}

const CustomOptionStyles = styled.div`
  p {
    color: #4b5563;
  }
  .options {
    margin: 1.5rem 0 1.75rem;
  }

  .option {
    margin: 0 0 1rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;

    &:last-of-type {
      margin: 0;
    }
  }

  .toggle-button {
    padding: 0;
    position: relative;
    flex-shrink: 0;
    display: inline-flex;
    height: 1.5rem;
    width: 2.75rem;
    border: 2px solid transparent;
    border-radius: 9999px;
    transition-property: background-color, border-color, color, fill, stroke;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    cursor: pointer;

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px,
        rgb(99, 102, 241) 0px 0px 0px 4px, rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    }

    &.on {
      background-color: #4338ca;
      & .switch {
        transform: translateX(1.25rem);
      }
    }

    &.off {
      background-color: #e5e7eb;
      & .switch {
        transform: translateX(0rem);
      }
    }
  }

  .switch {
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    background-color: #fff;
    border-radius: 9999px;
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
      rgba(59, 130, 246, 0.5) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0.1) 0px 1px 3px 0px, rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    pointer-events: none;
    transition-duration: 0.2s;
    transition-property: background-color, border-color, color, fill, stroke,
      opacity, box-shadow, transform, filter, backdrop-filter,
      -webkit-backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toggle-description {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }

  .light {
    color: #6b7280;
  }

  .values {
    flex: 1;
    display: flex;
    gap: 1rem;
  }

  .item {
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  @media (max-width: 500px) {
    .values {
      flex-direction: column;
    }
  }
`;
