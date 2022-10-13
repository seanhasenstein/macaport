import { Field, ErrorMessage } from 'formik';
import styled from 'styled-components';

type Props = {
  as?: 'textarea';
  name: string;
  label: string;
  tabIndex?: string | number;
  type?: 'text' | 'email';
};

export function FieldItem({
  as,
  type = 'text',
  name,
  label,
  tabIndex = '0',
}: Props) {
  return (
    <FieldItemStyles>
      <label htmlFor={name}>{label}</label>
      <Field as={as} type={type} name={name} id={name} tabIndex={tabIndex} />
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
    font-size: 0.875rem;
    font-weight: 500;
    color: #6b7280;
  }

  input,
  textarea {
    padding: 0.625rem 0.75rem;
    display: block;
    width: 100%;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    font-size: 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.3125rem;
    appearance: none;
    background-color: #fff;
  }

  textarea {
    min-height: 7rem;
    resize: vertical;
  }

  .error {
    margin: 0.5rem 0 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: #b91c1c;
  }

  @media (max-width: 500px) {
    input,
    textarea {
      font-size: 1rem;
    }
  }
`;
