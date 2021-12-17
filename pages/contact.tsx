import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Layout from '../components/Layout';
import { removeNonDigits } from '../utils';

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

type FieldItemProps = {
  as?: 'textarea';
  name: string;
  label: string;
  tabIndex?: string | number;
  type?: 'text' | 'email';
};

function FieldItem({
  as,
  type = 'text',
  name,
  label,
  tabIndex = '0',
}: FieldItemProps) {
  return (
    <FieldItemStyles>
      <label htmlFor={name}>{label}</label>
      <Field as={as} type={type} name={name} tabIndex={tabIndex} />
      <ErrorMessage name={name} component="div" className="error" />
    </FieldItemStyles>
  );
}

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

function Success() {
  return (
    <SuccessStyles>
      <div className="wrapper">
        <div className="content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="icon"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3>Message Sent!</h3>
          <p>
            Thank you for contacting Macaport. We will be with you as soon as we
            can.
          </p>
          <Link href="/">
            <a className="button">Back to home</a>
          </Link>
        </div>
      </div>
    </SuccessStyles>
  );
}

const SuccessStyles = styled.div`
  margin: 0 auto;
  padding: 5rem 1.5rem;
  width: 100%;
  display: flex;
  align-items: center;

  .wrapper {
    margin: 0 auto;
    padding: 0 2rem;
    max-width: 38rem;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #fff;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 1px 3px 0px,
      rgba(0, 0, 0, 0.06) 0px 1px 2px 0px;
    text-align: center;
  }

  .content {
    padding: 2.5rem 0;
    max-width: 26rem;
    width: 100%;
  }

  .icon {
    margin: 0;
    height: 3rem;
    width: 3rem;
    color: #10b981;
  }

  h3 {
    margin: 0.25rem 0 1rem;
    font-size: 1.5rem;
    font-weight: 600;
    color: #111827;
  }

  p {
    margin: 0 0 1.5rem;
    font-size: 1rem;
    color: #6b7280;
    line-height: 1.5;
  }

  .button {
    padding: 0.75rem 2rem;
    display: inline-flex;
    justify-content: center;
    background-color: #22272f;
    color: rgba(255, 255, 255, 0.9);
    font-size: 1rem;
    font-weight: 500;
    border-radius: 0.25rem;
    text-align: center;
    transition: all 200ms ease-in-out;

    &:hover {
      background-color: #323a46;
      color: rgba(255, 255, 255, 1);
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2563eb 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }
  }

  @media (max-width: 500px) {
    padding: 4rem 1.5rem;

    .wrapper {
      background: transparent;
      box-shadow: none;
    }

    .content {
      padding: 0;
    }

    h3 {
      margin: 0.25rem 0 1.5rem;
    }

    p {
      margin: 0 0 2rem;
    }

    .button {
      width: 100%;
    }
  }
`;

type FormStatus = 'IDLE' | 'SUCCESS' | 'ERROR';

export default function Contact() {
  const [serverError, setServerError] = React.useState();
  const [status, setStatus] = React.useState<FormStatus>('IDLE');

  if (status === 'SUCCESS') {
    return (
      <Layout>
        <Success />
      </Layout>
    );
  }

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

              setStatus('SUCCESS');
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="grid-cols-2">
                  <FieldItem name="firstName" label="First Name" />
                  <FieldItem name="lastName" label="Last Name" />
                </div>
                <FieldItem type="email" name="email" label="Email" />
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
                {serverError && (
                  <div className="server-error">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>
                      Oh no, something went wrong. If you continue to have
                      problems please{' '}
                      <a href="mailto:support@macaport.com">contact us here</a>.
                    </span>
                  </div>
                )}
              </Form>
            )}
          </Formik>
        </div>
      </ContactStyles>
    </Layout>
  );
}

const ContactStyles = styled.div`
  padding: 0 1.5rem;
  position: relative;

  .wrapper {
    margin: 0 auto;
    padding: 4rem 0 6rem;
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
    max-width: 32rem;
    text-align: center;
  }

  form {
    margin: 2.5rem 0 0;
    display: flex;
    flex-direction: column;
    max-width: 32rem;
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
    background-color: #253753;
    color: rgba(2255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    border-radius: 0.3125rem;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: #2b4061;
      color: rgba(255, 255, 255, 1);
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #2563eb 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
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

  .server-error {
    margin: 1rem 0 0;
    padding: 1.125rem;
    display: flex;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: #cd2121;
    background-color: #fef2f2;
    border: 1px solid #fde0e0;
    border-radius: 0.25rem;

    a {
      text-decoration: underline;
    }

    svg {
      margin: 0 0.5rem 0 0;
      flex-shrink: 0;
      height: 1.375rem;
      width: 1.375rem;
      color: #f87171;
    }
  }

  @media (max-width: 500px) {
    .button {
      width: 100%;
    }
  }
`;
