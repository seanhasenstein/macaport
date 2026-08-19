import { Field, ErrorMessage } from 'formik';
import styled from 'styled-components';
import { theme, focusField } from '../../styles/theme';

type Option = { value: string; label: string };

type Props = {
  name: string;
  label: string;
  note?: string;
  optional?: boolean;
  placeholder?: string;
  options: (Option | string)[];
};

const toOption = (option: Option | string): Option =>
  typeof option === 'string' ? { value: option, label: option } : option;

export function SelectItem({
  name,
  label,
  note,
  optional,
  placeholder = 'Choose one',
  options,
}: Props) {
  return (
    <SelectItemStyles>
      <label htmlFor={name}>
        {label}
        {optional && <span className="optional">Optional</span>}
      </label>
      {note && <p className="note">{note}</p>}
      <Field as="select" name={name} id={name}>
        <option value="">{placeholder}</option>
        {options.map(option => {
          const { value, label: optionLabel } = toOption(option);
          return (
            <option key={value} value={value}>
              {optionLabel}
            </option>
          );
        })}
      </Field>
      <ErrorMessage name={name} component="div" className="error" />
    </SelectItemStyles>
  );
}

const SelectItemStyles = styled.div`
  margin: 1.25rem 0 0;
  display: flex;
  flex-direction: column;

  label {
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

  select {
    padding: 0.625rem 2.25rem 0.625rem 0.75rem;
    display: block;
    width: 100%;
    font-size: 0.875rem;
    color: ${theme.color.text};
    background-color: ${theme.color.surface};
    border: 1px solid ${theme.color.borderField};
    border-radius: ${theme.radius.md};
    box-shadow: none;
    /* appearance: none is set globally, so the chevron has to be drawn here. */
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23737373'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.625rem center;
    background-size: 1.125rem;
    cursor: pointer;

    &:focus {
      ${focusField}
    }
  }

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${theme.color.danger};
  }

  @media (max-width: 500px) {
    select {
      font-size: 1rem;
    }
  }
`;
