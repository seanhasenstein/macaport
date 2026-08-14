import { Field, ErrorMessage, useField, useFormikContext } from 'formik';
import styled from 'styled-components';
import {
  theme,
  focusField,
  focusRingNeutral,
  reducedMotion,
} from '../../styles/theme';

type Option = { id: string; label: string };

type Props = {
  name: string;
  label: string;
  note?: string;
  optional?: boolean;
  options: Option[];
  // When set, a quantity input appears beside each checked item, stored at
  // `${quantityName}.${option.id}`. Omit it for lists where a count is
  // meaningless, like what a team store should carry.
  quantityName?: string;
};

// Digits and a hyphen, filtered on the way in. Not type="number" — that
// accepts "e", "+" and "-" anyway, and its scroll-wheel stepping changes
// quantities by accident when someone scrolls the page.
//
// The hyphen is there because this field is required and has no "not sure"
// option, unlike every other question on the form. Someone who hasn't counted
// heads yet can answer "20-40" honestly instead of inventing a number.
const cleanQuantity = (value: string) => {
  // Split rather than regex-collapse: at most one hyphen, and a leading one is
  // dropped since "-20" isn't a quantity. "20-" is allowed through so the
  // hyphen can be typed before the second number.
  const [first = '', second] = value.replace(/[^0-9-]/g, '').split('-');
  const from = first.slice(0, 5);

  if (second === undefined || !from) return from;

  return `${from}-${second.slice(0, 5)}`;
};

function QuantityField({ name, label }: { name: string; label: string }) {
  const [field, , helpers] = useField<string>(name);

  return (
    <input
      className="quantity"
      type="text"
      inputMode="numeric"
      autoComplete="off"
      placeholder="Qty"
      aria-label={`Quantity of ${label.toLowerCase()}`}
      name={name}
      value={field.value ?? ''}
      onBlur={field.onBlur}
      onChange={event => helpers.setValue(cleanQuantity(event.target.value))}
    />
  );
}

// Formik handles multiple checkboxes sharing one `name` by collecting the
// checked values into an array, which is why this needs no onChange of its own.
export function CheckboxGroup({
  name,
  label,
  note,
  optional,
  options,
  quantityName,
}: Props) {
  const { values } = useFormikContext<Record<string, unknown>>();
  const selected = (values[name] as string[]) ?? [];

  return (
    <CheckboxGroupStyles
      role="group"
      aria-labelledby={`${name}-label`}
      $withQuantities={Boolean(quantityName)}
    >
      <span className="label" id={`${name}-label`}>
        {label}
        {optional && <span className="optional">Optional</span>}
      </span>
      {note && <p className="note">{note}</p>}
      <div className="options">
        {options.map(option => {
          const isSelected = selected.includes(option.id);

          return (
            <div
              className={isSelected ? 'row selected' : 'row'}
              key={option.id}
            >
              {/* The label stretches across the row so the whole thing is a
                  hit target, but the quantity input stays outside it —
                  nested in a label, typing a number would toggle the box. */}
              <label className="option">
                <Field type="checkbox" name={name} value={option.id} />
                <span>{option.label}</span>
              </label>
              {quantityName && isSelected && (
                <QuantityField
                  name={`${quantityName}.${option.id}`}
                  label={option.label}
                />
              )}
            </div>
          );
        })}
      </div>
      <ErrorMessage name={name} component="div" className="error" />
      {quantityName && (
        <ErrorMessage name={quantityName} component="div" className="error" />
      )}
    </CheckboxGroupStyles>
  );
}

const CheckboxGroupStyles = styled.fieldset<{ $withQuantities: boolean }>`
  margin: 1.25rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  border: none;

  .label {
    margin: 0 0 0.5rem;
    display: flex;
    align-items: baseline;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 600;
    color: ${theme.color.text};
  }

  .optional {
    font-size: 0.75rem;
    font-weight: 400;
    color: ${theme.color.textSubtle};
  }

  .note {
    margin: -0.25rem 0 0.5rem;
    font-size: 0.8125rem;
    line-height: 1.45;
    color: ${theme.color.textMuted};
    /* Stops a note ending on a single stranded word. */
    text-wrap: pretty;
  }

  /* Both variants wrap to as many columns as fit; rows carrying a quantity
     input just need more room before they'll split. Ten items in one column
     is a wall, so this halves the height wherever the card is wide enough. */
  .options {
    display: grid;
    grid-template-columns: ${props =>
      props.$withQuantities
        ? 'repeat(auto-fit, minmax(15rem, 1fr))'
        : 'repeat(auto-fit, minmax(12rem, 1fr))'};
    gap: 0.5rem;
  }

  /* Each item is a bounded row rather than a loose checkbox. It gives the
     quantity input something to sit inside, so the number reads as belonging
     to the item beside it instead of floating at the far edge of the card. */
  .row {
    padding: ${props =>
      props.$withQuantities ? '0.4375rem 0.5rem 0.4375rem 0.75rem' : '0.625rem 0.75rem'};
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-height: ${props => (props.$withQuantities ? '2.875rem' : 'auto')};
    background-color: ${theme.color.surface};
    border: 1px solid ${theme.color.borderField};
    border-radius: ${theme.radius.md};
    transition: border-color 150ms ease, background-color 150ms ease;
    ${reducedMotion}

    &:hover {
      border-color: ${theme.color.textSubtle};
    }

    /* Matches the checked box itself. It has to be darker than an unchecked
       row, not lighter — the selected state should never be the faintest
       thing in the group. */
    &.selected {
      background-color: ${theme.color.brandSubtle};
      border-color: ${theme.color.brand};
    }
  }

  /* Fills the row so clicking anywhere left of the input toggles the item. */
  .option {
    margin: 0;
    flex: 1;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.875rem;
    font-weight: 400;
    color: ${theme.color.text};
    cursor: pointer;
  }

  .quantity {
    padding: 0.375rem 0.5rem;
    width: 5.75rem;
    flex-shrink: 0;
    text-align: center;
    font-size: 0.875rem;
    font-variant-numeric: tabular-nums;
    color: ${theme.color.text};
    background-color: ${theme.color.surface};
    border: 1px solid ${theme.color.borderField};
    border-radius: ${theme.radius.md};
    box-shadow: none;
    appearance: none;

    &::placeholder {
      color: ${theme.color.textSubtle};
    }

    &:focus {
      ${focusField}
    }
  }

  input[type='checkbox'] {
    height: 1rem;
    width: 1rem;
    flex-shrink: 0;
    color: ${theme.color.brand};
    background-color: ${theme.color.surface};
    border: 1px solid ${theme.color.borderField};
    border-radius: 0.25rem;
    box-shadow: none;
    cursor: pointer;

    &:focus-visible {
      ${focusRingNeutral}
    }
  }

  /* The fill and border have to be repeated here. GlobalStyles sets them on
     :checked, but this component's selector carries a class and outranks it,
     so without these the box stayed white and the white tick was invisible. */
  input[type='checkbox']:checked {
    background-color: ${theme.color.brand};
    border-color: ${theme.color.brand};
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='white'%3E%3Cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 111.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3E%3C/svg%3E");
    background-size: 90%;
    background-position: center;
    background-repeat: no-repeat;
  }

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${theme.color.danger};
  }

  @media (max-width: 500px) {
    .option {
      font-size: 1rem;
    }
  }
`;
