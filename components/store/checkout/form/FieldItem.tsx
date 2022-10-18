import { Field } from 'formik';
import styled from 'styled-components';
import ErrorMessage from './ErrorMessage';

type Props = {
  name: string;
  label: string;
};

export default function FieldItem(props: Props) {
  return (
    <FieldItemStyles>
      <label htmlFor={props.name}>{props.label}</label>
      <Field id={props.name} name={props.name} />
      <ErrorMessage name={props.name} />
    </FieldItemStyles>
  );
}

export const FieldItemStyles = styled.div`
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
`;
