import React from 'react';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import Layout from '../components/Layout';
import { Success } from 'components/contact/Success';
import ServerError from 'components/contact/ServerError';
import { FieldItem } from 'components/contact/FieldItem';
import { ContactFormValues } from 'interfaces';
import { initialValues, validationSchema } from 'utils/contact';

export default function Contact() {
  const [status, setStatus] = React.useState<'IDLE' | 'SUCCESS' | 'ERROR'>(
    'IDLE'
  );

  const handleSubmit = async (values: ContactFormValues) => {
    if (values.honeypot) return;

    const response = await fetch('/api/send-message', {
      method: 'post',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      setStatus('ERROR');
      return;
    } else {
      setStatus('SUCCESS');
    }
  };

  return (
    <Layout>
      <>
        {status === 'SUCCESS' ? (
          <Success />
        ) : (
          <ContactStyles>
            <div className="wrapper">
              <h2>Contact Us</h2>
              <p>
                Do you have a question or inquery for us? Fill out the form
                below and we will get back to you as soon as we can.
              </p>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={values => handleSubmit(values)}
              >
                {({ isSubmitting, values }) => (
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
                    <button
                      type="submit"
                      disabled={values.honeypot !== ''}
                      className="button"
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner" />
                          <span className="sr-only">Loading</span>
                        </>
                      ) : (
                        'Send your message'
                      )}
                    </button>
                    <ServerError serverError={status === 'ERROR'} />
                  </Form>
                )}
              </Formik>
            </div>
          </ContactStyles>
        )}
      </>
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
    color: #4b5563;
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
    padding: 0;
    position: relative;
    width: 100%;
    height: 45px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    align-self: flex-end;
    background-color: #1f2e45;
    color: rgba(2255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 500;
    border: none;
    border-radius: 0.3125rem;
    text-align: center;
    cursor: pointer;

    &:hover {
      background-color: #192538;
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
    border-top: 2px solid rgba(255, 255, 255, 0.5);
    border-right: 2px solid transparent;
    animation: spinner 0.6s linear infinite;
  }

  @media (max-width: 500px) {
    .button {
      width: 100%;
    }
  }
`;
