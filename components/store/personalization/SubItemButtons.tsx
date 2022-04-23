import {
  AddonItems,
  PersonalizationAddon,
  PersonalizationItem,
} from '../../../interfaces';
import React from 'react';
import styled from 'styled-components';
import { createId, formatToMoney } from '../../../utils';

type Props = {
  baseAddonItem: PersonalizationAddon;
  personalizationSubItem: PersonalizationItem;
  addonItems: AddonItems;
  setAddonItems: React.Dispatch<React.SetStateAction<AddonItems>>;
  linesAvailable: number;
  setLinesAvailable: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
};

function createInitialSubItem(
  personalizationSubItem: PersonalizationItem
): PersonalizationAddon {
  const newItem = {
    id: createId('sub'),
    itemId: personalizationSubItem.id,
    addon: personalizationSubItem.name,
    value: '',
    name: personalizationSubItem.name,
    lines: personalizationSubItem.lines,
    limit: personalizationSubItem.limit,
    price: personalizationSubItem.price,
    type: personalizationSubItem.type,
    list: personalizationSubItem.list,
    location: personalizationSubItem.location,
    subItems: [],
  };

  return newItem;
}

export default function SubItemButtons(props: Props) {
  const [filteredSubItems, setFilteredSubItems] = React.useState<
    PersonalizationAddon[]
  >([]);

  React.useEffect(() => {
    const updatedSubItems = props.baseAddonItem.subItems.filter(
      subItem => subItem.itemId === props.personalizationSubItem.id
    );
    setFilteredSubItems(updatedSubItems);
  }, [props.baseAddonItem.subItems, props.personalizationSubItem.id]);

  const handleAddSubItem = () => {
    const updatedBaseAddonItem: PersonalizationAddon = {
      ...props.baseAddonItem,
      subItems: [
        ...props.baseAddonItem.subItems,
        createInitialSubItem(props.personalizationSubItem),
      ],
    };

    const updatedBaseAddonItems = props.addonItems[
      props.baseAddonItem.itemId
    ].map(addonItem => {
      if (addonItem.id === updatedBaseAddonItem.id) {
        return updatedBaseAddonItem;
      } else {
        return addonItem;
      }
    });

    const updatedAddonItems: AddonItems = {
      ...props.addonItems,
      [props.baseAddonItem.itemId]: updatedBaseAddonItems,
    };

    props.setAddonItems(updatedAddonItems);
    props.setLinesAvailable(
      prevState => prevState - props.personalizationSubItem.lines
    );
    props.setTotal(prevState => prevState + props.personalizationSubItem.price);
  };

  return (
    <SubItemButtonStyles>
      {filteredSubItems.length <= 0 &&
      props.linesAvailable >= props.personalizationSubItem.lines ? (
        <button
          type="button"
          onClick={handleAddSubItem}
          className="add-subitem-button"
        >
          Add{' '}
          <span className="emphasis">{props.personalizationSubItem.name}</span>{' '}
          <span className="text-sm">
            (+
            {formatToMoney(props.personalizationSubItem.price, true)})
          </span>
        </button>
      ) : null}

      {filteredSubItems.length > 0 &&
      filteredSubItems.length < props.personalizationSubItem.limit &&
      props.linesAvailable >= props.personalizationSubItem.lines ? (
        <button
          type="button"
          onClick={handleAddSubItem}
          className="add-subitem-button"
        >
          Add{' '}
          <span className="emphasis">{props.personalizationSubItem.name}</span>{' '}
          <span className="text-sm">
            (+
            {formatToMoney(props.personalizationSubItem.price, true)})
          </span>
        </button>
      ) : null}
    </SubItemButtonStyles>
  );
}

const SubItemButtonStyles = styled.div`
  .add-subitem-button {
    margin: 1rem 0 0;
    padding: 0.5rem 1.25rem;
    background-color: #e5e7eb;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    cursor: pointer;
    transition: all 150ms linear;
    width: 100%;

    .text-sm {
      font-size: 0.75rem;
    }

    &:hover {
      color: #000;
      background-color: #dadde2;
      border-color: #c6cbd2;
    }
  }

  .emphasis {
    text-transform: lowercase;
    font-weight: 600;
  }
`;
