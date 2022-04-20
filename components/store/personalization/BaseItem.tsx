import React from 'react';
import styled from 'styled-components';
import { AddonItems, PersonalizationItem } from '../../../interfaces';
import { createId, formatToMoney } from '../../../utils';
import SubItem from './SubItem';
import SubItemButtons from './SubItemButtons';

interface BaseItemProps {
  personalizationItem: PersonalizationItem;
  addonItems: AddonItems;
  setAddonItems: React.Dispatch<React.SetStateAction<AddonItems>>;
  linesAvailable: number;
  setLinesAvailable: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
}

export default function BaseItem(props: BaseItemProps) {
  const initialAddonItem = {
    id: createId('base'),
    itemId: props.personalizationItem.id,
    addon: props.personalizationItem.name,
    value: '',
    name: props.personalizationItem.name,
    lines: props.personalizationItem.lines,
    limit: props.personalizationItem.limit,
    price: props.personalizationItem.price,
    location: props.personalizationItem.location,
    type: props.personalizationItem.type,
    list: props.personalizationItem.list,
    subItems: [],
  };

  const handleAddItemClick = () => {
    const updatedAddonItems: AddonItems = {
      ...props.addonItems,
      [props.personalizationItem.id]: [
        ...props.addonItems[props.personalizationItem.id],
        initialAddonItem,
      ],
    };
    props.setAddonItems(updatedAddonItems);
    props.setLinesAvailable(
      prevState => prevState - props.personalizationItem.lines
    );
    props.setTotal(prevState => prevState + props.personalizationItem.price);
  };

  const handleValueChange = (addonItemId: string, value: string) => {
    const updatedBaseItems = props.addonItems[props.personalizationItem.id].map(
      item => {
        if (item.id === addonItemId) {
          return { ...item, value };
        } else {
          return item;
        }
      }
    );
    const updatedAddonItems = {
      ...props.addonItems,
      [props.personalizationItem.id]: updatedBaseItems,
    };
    props.setAddonItems(updatedAddonItems);
  };

  const removeItem = (removedItemId: string) => {
    const removedItemIndex = props.addonItems[
      props.personalizationItem.id
    ].findIndex(item => item.id === removedItemId);
    const updatedBaseAddonItem = [
      ...props.addonItems[props.personalizationItem.id],
    ];
    updatedBaseAddonItem.splice(removedItemIndex, 1);
    const updatedAddonItems = {
      ...props.addonItems,
      [props.personalizationItem.id]: updatedBaseAddonItem,
    };
    const subItems = props.addonItems[props.personalizationItem.id][
      removedItemIndex
    ].subItems.reduce(
      (accumulator, currentSubItem) => {
        return {
          lines: accumulator.lines + currentSubItem.lines,
          total: accumulator.total + currentSubItem.price,
        };
      },
      { lines: 0, total: 0 }
    );
    props.setAddonItems(updatedAddonItems);
    props.setLinesAvailable(
      prevState => prevState + props.personalizationItem.lines + subItems.lines
    );
    props.setTotal(
      prevState => prevState - props.personalizationItem.price - subItems.total
    );
  };

  return (
    <BaseItemStyles>
      {props.linesAvailable >= props.personalizationItem.lines &&
        props.addonItems[props.personalizationItem.id].length === 0 && (
          <button
            type="button"
            onClick={handleAddItemClick}
            className="activate-button"
          >
            Add{' '}
            <span className="emphasis">{props.personalizationItem.name}</span>{' '}
            on the {props.personalizationItem.location.toLowerCase()} (+
            {formatToMoney(props.personalizationItem.price, true)})
          </button>
        )}

      {props.addonItems[props.personalizationItem.id].map(
        (baseItem, index, array) => (
          <React.Fragment key={`${baseItem.id}-${index}`}>
            <div className="addon-item">
              {props.personalizationItem.type === 'string' && (
                <div className="field">
                  <label htmlFor={baseItem.id}>
                    {props.personalizationItem.name} on the{' '}
                    {props.personalizationItem.location.toLowerCase()}{' '}
                    {props.personalizationItem.limit > 1
                      ? `#${index + 1}`
                      : null}{' '}
                    <span>
                      +{formatToMoney(props.personalizationItem.price, true)}
                    </span>
                  </label>
                  <input
                    type="text"
                    name={baseItem.id}
                    id={baseItem.id}
                    value={baseItem.value}
                    onChange={e =>
                      handleValueChange(baseItem.id, e.target.value)
                    }
                  />
                </div>
              )}

              {props.personalizationItem.type === 'number' && (
                <div className="field">
                  <label htmlFor={baseItem.id}>
                    {props.personalizationItem.name} on the{' '}
                    {props.personalizationItem.location.toLowerCase()}{' '}
                    {props.personalizationItem.limit > 1
                      ? `#${index + 1}`
                      : null}{' '}
                    <span>
                      +{formatToMoney(props.personalizationItem.price, true)}
                    </span>
                  </label>
                  <input
                    type="number"
                    name={baseItem.id}
                    id={baseItem.id}
                    value={baseItem.value}
                    onChange={e =>
                      handleValueChange(baseItem.id, e.target.value)
                    }
                  />
                </div>
              )}

              {props.personalizationItem.type === 'list' && (
                <div className="field">
                  <label htmlFor={baseItem.id}>
                    {props.personalizationItem.name} on the{' '}
                    {props.personalizationItem.location.toLowerCase()}{' '}
                    {props.personalizationItem.limit > 1
                      ? `#${index + 1}`
                      : null}{' '}
                    <span>
                      +{formatToMoney(props.personalizationItem.price, true)}
                    </span>
                  </label>
                  <select
                    name={baseItem.id}
                    id={baseItem.id}
                    value={baseItem.value}
                    onChange={e =>
                      handleValueChange(baseItem.id, e.target.value)
                    }
                  >
                    <option value="DEFAULT">
                      Select {props.personalizationItem.name}
                    </option>
                    {props.personalizationItem.list.map(listItem => (
                      <option key={listItem} value={listItem}>
                        {listItem}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                {baseItem.subItems.map(subItem => (
                  <SubItem
                    key={subItem.id}
                    baseAddonItem={baseItem}
                    subItem={subItem}
                    addonItems={props.addonItems}
                    setAddonItems={props.setAddonItems}
                    setLinesAvailable={props.setLinesAvailable}
                    setTotal={props.setTotal}
                  />
                ))}

                {props.personalizationItem.subItems.map(
                  personalizationSubItem => (
                    <SubItemButtons
                      key={personalizationSubItem.id}
                      baseAddonItem={baseItem}
                      personalizationSubItem={personalizationSubItem}
                      addonItems={props.addonItems}
                      setAddonItems={props.setAddonItems}
                      linesAvailable={props.linesAvailable}
                      setLinesAvailable={props.setLinesAvailable}
                      setTotal={props.setTotal}
                    />
                  )
                )}
              </div>

              <button
                type="button"
                onClick={() => removeItem(baseItem.id)}
                className="remove-button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                <span className="sr-only">Remove {baseItem.value}</span>
              </button>
            </div>

            {props.linesAvailable >= props.personalizationItem.lines &&
            props.personalizationItem.limit >
              props.addonItems[props.personalizationItem.id].length &&
            index + 1 === array.length ? (
              <button
                type="button"
                onClick={handleAddItemClick}
                className="add-field-button"
              >
                Add another {props.personalizationItem.name.toLowerCase()}{' '}
                <span className="text-sm">
                  (+{formatToMoney(props.personalizationItem.price, true)})
                </span>
              </button>
            ) : null}
          </React.Fragment>
        )
      )}
    </BaseItemStyles>
  );
}

const BaseItemStyles = styled.div`
  .addon-item {
    position: relative;
    margin: 0 0 1.75rem;
    padding: 1rem 2.75rem 1rem 1rem;
    background-color: #f9fafb;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
  }

  .field {
    width: 100%;
    display: flex;
    flex-direction: column;

    label {
      padding-right: 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      color: #1f2937;

      span {
        color: #059669;
        font-size: 0.75rem;
        font-weight: 600;
      }
    }
  }

  .remove-button {
    position: absolute;
    right: 0.5625rem;
    top: 2.625rem;
    height: 1.875rem;
    width: 1.875rem;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: transparent;
    border: none;
    color: #9ca3af;
    cursor: pointer;
    border-radius: 9999px;
    transition: all 200ms linear;

    &:hover {
      color: #1f2937;
    }

    svg {
      height: 1.125rem;
      width: 1.125rem;
    }
  }

  .activate-subfield-button {
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

  .add-field-button,
  .activate-button {
    margin: 0 0 1.375rem;
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

  .add-subfield-button {
    margin: 1rem 0 0;
  }
`;
