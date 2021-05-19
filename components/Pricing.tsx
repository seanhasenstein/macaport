import React from 'react';
import styled from 'styled-components';
import Table from './Table';
import { pricing } from '../data/pricing';

const PricingStyles = styled.div`
  .wrapper {
    margin: 0 auto;
    padding: 4rem 0;
    max-width: 64rem;
    width: 100%;
    border-top: 1px solid #e5e7eb;
  }

  h2 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 0;
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.625;
  }

  .buttons {
    margin: 3rem 0 0;
    padding: 0.25rem;
    max-width: 36rem;
    width: 100%;
    display: flex;
    justify-content: space-between;
    background-color: #f0f1f4;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;

    button {
      padding: 0.5rem 2rem;
      position: relative;
      width: 33.333333%;
      background-color: transparent;
      border: 1px solid transparent;
      border-radius: 0.375rem;
      font-weight: 600;
      white-space: nowrap;
      color: #4b5563;
      cursor: pointer;

      &:hover {
        background-color: #e5e7eb;
      }

      &.active {
        background-color: #fff;
        border-color: #e5e7eb;
        box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
          rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
      }
    }
  }

  .table {
    margin: 2.5rem 0 0;
    padding: 0.5rem;
    background-color: #fff;
    border: 1px solid #f3f4f6;
    border-radius: 0.25rem;
  }
`;

type ButtonProps = {
  label: string;
  category: activeState;
  active: activeState;
  setActive: (input: activeState) => void;
};

function Button({ label, category, active, setActive }: ButtonProps) {
  return (
    <button
      onClick={() => setActive(category)}
      className={category === active ? 'active' : ''}
    >
      {label}
    </button>
  );
}

const columns = [
  'Quantity',
  '1 Ink Color',
  '2 Ink Colors',
  '3 Ink Colors',
  '4 Ink Colors',
  '5 Ink Colors',
];

type activeState = 'tshirt' | 'hoodie' | 'crewneck';

export default function Pricing() {
  const [active, setActive] = React.useState<activeState>('tshirt');

  return (
    <PricingStyles>
      <div className="wrapper">
        <h2>Pricing</h2>
        <p>A breakdown of our prices per quantity and number of colors.</p>
        <div className="buttons">
          <Button
            label="T-Shirts"
            category="tshirt"
            active={active}
            setActive={setActive}
          />
          <Button
            label="Hooded Sweatshirts"
            category="hoodie"
            active={active}
            setActive={setActive}
          />
          <Button
            label="Crewneck Sweatshirts"
            category="crewneck"
            active={active}
            setActive={setActive}
          />
        </div>
        <div className="table">
          {active === 'tshirt' ? (
            <Table data={pricing.tshirts} columns={columns} />
          ) : null}
          {active === 'hoodie' ? (
            <Table data={pricing.hoodies} columns={columns} />
          ) : null}
          {active === 'crewneck' ? (
            <Table data={pricing.crewneck} columns={columns} />
          ) : null}
        </div>
      </div>
    </PricingStyles>
  );
}
