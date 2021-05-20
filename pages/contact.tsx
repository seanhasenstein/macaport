import React from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { removeNonDigits } from '../utils';

const ContactStyles = styled.div`
  padding: 4rem 1.5rem 6rem;

  .wrapper {
    margin: 0 auto;
    max-width: 32rem;
    width: 100%;
  }

  h2 {
    margin: 0;
    font-size: 1.75rem;
    text-align: center;
  }

  p {
    margin: 1rem 0 0;
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.5;
    text-align: center;
  }

  form {
    margin: 2.5rem 0 0;
    display: flex;
    flex-direction: column;
  }

  .grid-cols-2 {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
    gap: 0 1rem;
  }

  .button {
    margin: 1.25rem 0 0;
    padding: 0.875rem 2.5rem;
    position: relative;
    min-width: 180px;
    height: 45px;
    display: inline-flex;
    justify-content: center;
    align-self: flex-end;
    background-color: #1b2c49;
    color: rgba(2255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    border-radius: 0.3125rem;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: #203557;
      color: rgba(255, 255, 255, 1);
    }
  }

  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  .spinner:before {
    content: '';
    box-sizing: border-box;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin-top: -10px;
    margin-left: -10px;
    border-radius: 50%;
    border-top: 2px solid #fff;
    border-right: 2px solid transparent;
    animation: spinner 0.6s linear infinite;
  }

  @media (max-width: 500px) {
    .button {
      width: 100%;
    }
  }
`;

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  honeypot: '',
};

const schema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('A valid email is required')
    .required('Email address is required'),
  phone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Phone number must be 10 digits')
    .required('Phone number is required'),
  message: Yup.string().required('A message is required'),
});

const FieldItemStyles = styled.div`
  margin: 0.875rem 0 0;
  display: flex;
  flex-direction: column;

  label {
    margin: 0 0 0.25rem;
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

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      border-color: #3b82f6;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px,
        rgb(59, 130, 246) 0px 0px 0px 1px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  textarea {
    min-height: 7rem;
    resize: vertical;
  }

  .error {
    margin: 0.25rem 0 0;
    font-size: 0.875rem;
    font-size: 0.8125rem;
    line-height: 1.25rem;
    color: #dc2626;
  }

  @media (max-width: 500px) {
    input,
    textarea {
      font-size: 1rem;
    }
  }
`;

type FieldItemProps = {
  as?: 'textarea';
  name: string;
  label: string;
  tabIndex?: string | number;
};

function FieldItem({ as, name, label, tabIndex = '0' }: FieldItemProps) {
  return (
    <FieldItemStyles>
      <label htmlFor={name}>{label}</label>
      <Field as={as} name={name} tabIndex={tabIndex} />
      <ErrorMessage name={name} component="div" className="error" />
    </FieldItemStyles>
  );
}

export default function Contact() {
  const [serverError, setServerError] = React.useState();

  return (
    <Layout>
      <ContactStyles>
        <div className="wrapper">
          <h2>Contact Us</h2>
          <p>
            Have a question or inquery for us? Fill out the form below and we
            will get back to you as soon as we can.
          </p>
          <Formik
            initialValues={initialValues}
            validationSchema={schema}
            onSubmit={async values => {
              if (values.honeypot) return;

              const response = await fetch('/api/send-message', {
                method: 'post',
                body: JSON.stringify(values),
                headers: {
                  'Content-Type': 'application/json',
                },
              });

              const data = await response.json();

              if (data.error) {
                setServerError(data.error);
                return;
              }

              // if here then fetch req was successful...
              console.log(data);
              // show success message/redirect to success page
              // reset form state
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="grid-cols-2">
                  <FieldItem name="firstName" label="First Name" />
                  <FieldItem name="lastName" label="Last Name" />
                </div>
                <FieldItem name="email" label="Email" />
                <FieldItem name="phone" label="Phone" />
                <FieldItem as="textarea" name="message" label="Message" />
                <div className="sr-only">
                  <FieldItem
                    name="honeypot"
                    label="Please do not fill this field out"
                    tabIndex="-1"
                  />
                </div>
                <button type="submit" className="button">
                  {isSubmitting ? <span className="spinner" /> : 'Send message'}
                </button>
                {serverError && <div className="error">{serverError}</div>}
              </Form>
            )}
          </Formik>
        </div>
      </ContactStyles>
    </Layout>
  );
}
