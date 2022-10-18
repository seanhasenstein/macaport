import { ErrorMessage as FormikErrorMessage } from 'formik';
import styled from 'styled-components';

type Props = {
  name: string;
};

export default function ErrorMessage(props: Props) {
  return (
    <FormikErrorMessage
      name={props.name}
      render={msg => <ErrorMessageStyles>{msg}</ErrorMessageStyles>}
    />
  );
}

const ErrorMessageStyles = styled.div`
  margin: 0.5rem 0 0;
  font-size: 0.8125rem;
  font-weight: 500;
  color: #b91c1c;
`;
