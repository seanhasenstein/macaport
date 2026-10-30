import React from 'react';
import { useField } from 'formik';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';

type Props = {
  name: string;
  label: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'tel';
  inputMode?: 'text' | 'numeric' | 'tel' | 'email';
  autoComplete?: string;
  // Rewrites what was typed before it reaches Formik. Receives the raw input
  // and the value it is replacing, so a formatter can tell typing from
  // deleting. Without it the field behaves as a plain Formik field. Same
  // shape as the contact form's field, so one formatter serves both.
  format?: (next: string, previous: string) => string;
};

export default function FieldItem({
  name,
  label,
  placeholder,
  type = 'text',
  inputMode,
  autoComplete,
  format,
}: Props) {
  const [field, , helpers] = useField<string>(name);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!format) {
      field.onChange(event);
      return;
    }
    helpers.setValue(format(event.target.value, field.value ?? ''));
  };

  return (
    <FieldItemStyles>
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={field.value ?? ''}
        onChange={handleChange}
        onBlur={field.onBlur}
      />
      <ErrorMessage name={name} />
    </FieldItemStyles>
  );
}

export const FieldItemStyles = styled.div`
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
`;
