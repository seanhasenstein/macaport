import React from 'react';
import { ErrorMessage, useField } from 'formik';
import styled from 'styled-components';
import { theme, focusField } from '../../styles/theme';

type Props = {
  as?: 'textarea';
  name: string;
  label: string;
  note?: string;
  optional?: boolean;
  placeholder?: string;
  tabIndex?: string | number;
  type?: 'text' | 'email' | 'date' | 'tel';
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  autoComplete?: string;
  // Rewrites what the user typed before it reaches Formik. Receives the raw
  // input and the value it's replacing, so a formatter can tell typing from
  // deleting. Without it the field behaves as a plain Formik field.
  format?: (next: string, previous: string) => string;
};

export function FieldItem({
  as,
  type = 'text',
  name,
  label,
  note,
  optional,
  placeholder,
  tabIndex = '0',
  inputMode,
  autoComplete,
  format,
}: Props) {
  const [field, , helpers] = useField<string>(name);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!format) {
      field.onChange(event);
      return;
    }

    helpers.setValue(format(event.target.value, field.value ?? ''));
  };

  const shared = {
    id: name,
    name,
    placeholder,
    // Callers pass "-1" as a string for the honeypot; the DOM types want a number.
    tabIndex: Number(tabIndex),
    autoComplete,
    value: field.value ?? '',
    onChange: handleChange,
    onBlur: field.onBlur,
  };

  return (
    <FieldItemStyles>
      <label htmlFor={name}>
        {label}
        {optional && <span className="optional">Optional</span>}
      </label>
      {note && <p className="note">{note}</p>}
      {as === 'textarea' ? (
        <textarea {...shared} />
      ) : (
        <input type={type} inputMode={inputMode} {...shared} />
      )}
      <ErrorMessage name={name} component="div" className="error" />
    </FieldItemStyles>
  );
}

const FieldItemStyles = styled.div`
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

  input,
  textarea {
    padding: 0.625rem 0.75rem;
    display: block;
    width: 100%;
    font-size: 0.875rem;
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

  textarea {
    min-height: 9.5rem;
    line-height: 1.55;
    resize: vertical;
  }

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: ${theme.color.danger};
  }

  @media (max-width: 500px) {
    input,
    textarea {
      font-size: 1rem;
    }
  }
`;
