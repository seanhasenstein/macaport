import React from 'react';
import styled from 'styled-components';
import { AddonItems, Personalization } from '../../../interfaces';
import BaseItem from './BaseItem';

interface Props extends Personalization {
  addonItems: AddonItems;
  setAddonItems: React.Dispatch<React.SetStateAction<AddonItems>>;
  linesAvailable: number;
  setLinesAvailable: React.Dispatch<React.SetStateAction<number>>;
  total: number;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  addClickedWithBlankField: boolean;
}

export default function ProductPersonalization(props: Props) {
  if (!props.active) {
    return null;
  }

  return (
    <PersonalizationStyles>
      <h4>Customize your apparel</h4>
      <p>
        Please be sure to check spelling before adding this item to your order.
      </p>
      <p className="lines-used">
        Lines available: {props.linesAvailable}/{props.maxLines}
      </p>
      <div className="personalization-container">
        {props.addons.map((personalizationItem, index) => (
          <BaseItem
            key={`${personalizationItem.id}-${index}`}
            addonItems={props.addonItems}
            setAddonItems={props.setAddonItems}
            linesAvailable={props.linesAvailable}
            setLinesAvailable={props.setLinesAvailable}
            setTotal={props.setTotal}
            personalizationItem={personalizationItem}
            addClickedWithBlankField={props.addClickedWithBlankField}
          />
        ))}
      </div>
    </PersonalizationStyles>
  );
}

const PersonalizationStyles = styled.div`
  margin: 3rem 0 2.25rem;
  padding: 0 0 1rem;
  border-bottom: 1px solid #d1d5db;

  .personalization-container {
    margin: 1.75rem 0 0;
  }

  p {
    font-size: 0.9375rem;
    line-height: 1.35rem;
    color: #4b5563;

    &.lines-used {
      margin: 1.5rem 0 0;
      font-weight: 500;
      color: #111827;
    }
  }
`;
