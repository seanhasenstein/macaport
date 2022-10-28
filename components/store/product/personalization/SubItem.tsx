import usePersonalizationSubItem from 'hooks/usePersonalizationSubItem';
import styled from 'styled-components';
import { AddonItems, PersonalizationAddon } from '../../../../interfaces';
import { formatToMoney } from '../../../../utils';

interface Props {
  baseAddonItem: PersonalizationAddon;
  subItem: PersonalizationAddon;
  addonItems: AddonItems;
  setAddonItems: React.Dispatch<React.SetStateAction<AddonItems>>;
  setLinesAvailable: React.Dispatch<React.SetStateAction<number>>;
  setTotal: React.Dispatch<React.SetStateAction<number>>;
  addClickedWithBlankField: boolean;
}

export default function SubItem(props: Props) {
  const { handleValueChange, removeItem } = usePersonalizationSubItem({
    addonItems: props.addonItems,
    setAddonItems: props.setAddonItems,
    baseAddonItem: props.baseAddonItem,
    subItem: props.subItem,
    setLinesAvailable: props.setLinesAvailable,
    setTotal: props.setTotal,
  });

  return (
    <SubItemStyles>
      {props.subItem.type === 'string' && (
        <div className="field">
          <label htmlFor={props.subItem.id}>
            {props.subItem.name}
            <span>+{formatToMoney(props.subItem.price, true)}</span>
          </label>
          <input
            type="text"
            name={props.subItem.id}
            id={props.subItem.id}
            value={props.subItem.value}
            onChange={e => handleValueChange(e.target.value)}
            className={
              props.addClickedWithBlankField && props.subItem.value === ''
                ? 'validation-error'
                : ''
            }
          />
        </div>
      )}

      {props.subItem.type === 'number' && (
        <div className="field">
          <label htmlFor={props.subItem.id}>
            {props.subItem.name}
            <span>+{formatToMoney(props.subItem.price, true)}</span>
          </label>
          <input
            type="number"
            name={props.subItem.id}
            id={props.subItem.id}
            value={props.subItem.value}
            onChange={e => handleValueChange(e.target.value)}
            className={
              props.addClickedWithBlankField && props.subItem.value === ''
                ? 'validation-error'
                : ''
            }
          />
        </div>
      )}

      {props.subItem.type === 'list' && (
        <div className="field">
          <label htmlFor={props.subItem.id}>
            {props.subItem.name}
            <span>+{formatToMoney(props.subItem.price, true)}</span>
          </label>
          <select
            name={props.subItem.id}
            id={props.subItem.id}
            value={props.subItem.value}
            onChange={e => handleValueChange(e.target.value)}
            className={
              props.addClickedWithBlankField && props.subItem.value === ''
                ? 'validation-error'
                : ''
            }
          >
            <option value="DEFAULT">Select {props.subItem.name}</option>
            {props.subItem.list?.map(listItem => (
              <option key={listItem} value={listItem}>
                {listItem}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="button"
        onClick={removeItem}
        className="remove-subitem-button"
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
        <span className="sr-only">Remove {props.subItem.value}</span>
      </button>
    </SubItemStyles>
  );
}

const SubItemStyles = styled.div`
  position: relative;
  margin: 1.25rem 0;

  .remove-subitem-button {
    position: absolute;
    right: -2.25rem;
    top: 1.75rem;
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
      flex-shrink: 0;
      height: 1.125rem;
      width: 1.125rem;
    }
  }
`;
