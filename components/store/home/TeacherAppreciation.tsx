import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

import { useTeacherAppreciation } from 'hooks/useTeacherAppreciation';

type Props = {
  teacherAppreciationId: string;
  productLink: string;
};

export default function TeacherAppreciation({
  teacherAppreciationId,
  productLink,
}: Props) {
  const { alreadyUsed, email, isEligible, resetState, verifyEmail } =
    useTeacherAppreciation();

  const notEligibleNotAlreadyUsed = email && !isEligible && !alreadyUsed;
  const notEligibleAlreadyUsed = email && !isEligible && alreadyUsed;

  return (
    <TeacherAppreciationStyles>
      <div>
        <div className="new-london-bulldog-logo">
          <Image
            src="/images/new-london-bulldog-logo.png"
            alt="New London Bulldogs"
            width={233}
            height={187}
          />
        </div>
        <h3 className="title">
          New London teachers
          <br />
          get a free shirt!
        </h3>
        {isEligible && email ? (
          <div className="email-is-eligible">
            <CheckCircleIcon className="check-circle-icon" />
            <p className="paragraph">
              You're eligible for a free shirt!
              <br />
              Go to the{' '}
              <Link href={productLink}>
                <a>product page</a>
              </Link>{' '}
              to select your
              <br />
              color and size and add to cart.
            </p>
            <div className="current-email">
              <p className="email-label">Your email</p>
              <p className="email">{email}</p>
            </div>
            <button type="button" className="reset-button" onClick={resetState}>
              Use a different email
            </button>
          </div>
        ) : (
          <>
            <p className="instructions">
              For teacher appreciation week,
              <br />
              Macaport is giving a free shirt to all
              <br />
              New London teachers! Please enter your school email to redeem.
            </p>
            <Formik
              initialValues={{
                email: email ?? '',
              }}
              onSubmit={async (values, { resetForm }) => {
                const { isEligible } = await verifyEmail({
                  email: values.email,
                  teacherAppreciationId,
                });
                if (isEligible) {
                  resetForm();
                }
              }}
            >
              {() => (
                <Form>
                  <div className="field-item">
                    <label htmlFor="email">New London Email Account</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                    />
                  </div>
                  <button type="submit" className="redeem-button">
                    Redeem your free shirt
                  </button>
                  {/* Message for not eligible but not used */}
                  {notEligibleNotAlreadyUsed ? (
                    <div className="validation-error">
                      This email is not eligible.
                    </div>
                  ) : null}
                  {/* Message for not elibigle because already used */}
                  {notEligibleAlreadyUsed ? (
                    <div className="validation-error">
                      This email already used the discount.
                    </div>
                  ) : null}
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </TeacherAppreciationStyles>
  );
}

const TeacherAppreciationStyles = styled.div`
  margin: 0 auto;
  padding: 1.125rem 2rem 1.25rem;
  max-width: 22rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.25rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  text-align: center;

  .new-london-bulldog-logo {
    width: 2.75rem;
    margin: 0 auto;
  }

  .title {
    margin: 0.3125rem 0 0;
  }

  .instructions {
    margin: 0.75rem 0 0;
    padding: 0;
    max-width: unset;
    width: unset;
    font-size: 0.875rem;
    color: #1f2937;
  }

  .field-item {
    margin: 1.5rem 0 0;
    display: flex;
    flex-direction: column;

    label {
      margin: 0 0 0.625rem;
      text-align: left;
    }
  }

  .redeem-button {
    margin: 1rem 0 0;
    width: 100%;
    padding: 0.75rem 1.25rem;
    width: 100%;
    height: 2.625rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #31363f;
    color: #f3f4f5;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.011em;
    border: 1px solid #181a1e;
    border-radius: 0.25rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;
  }

  .email-is-eligible {
    display: flex;
    flex-direction: column;
    align-items: center;

    .check-circle-icon {
      margin: 0.75rem auto 0;
      flex-shrink: 0;
      height: 1.625rem;
      width: 1.625rem;
      color: #047857;
    }
    .paragraph {
      margin: 1rem 0 0;
      padding: 0;
      max-width: unset;
      width: unset;
      font-size: 0.875rem;
      word-wrap: break-word;
      color: #1f2937;
      &:first-of-type {
        margin: 0.375rem 0 0;
      }
      a {
        text-decoration: underline;
      }
    }
    .current-email {
      margin: 1.25rem 0 0;
      padding: 1.25rem 0.5rem;
      background-color: #f3f4f6;
      border: 1px solid #dcdfe4;
      border-radius: 0.1875rem;
      width: 100%;
    }
    .email-label {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.075em;
      color: #000;
      line-height: 120%;
    }
    .email {
      margin: 0.75rem 0 0;
      word-wrap: break-word;
      max-width: 17.375rem;
      line-height: 120%;
      font-size: 0.8125rem;
      color: #1f2937;
    }
    .reset-button {
      margin: 1.5rem 0 0;
      padding: 0;
      background-color: transparent;
      border: none;
      color: #6e788c;
      font-size: 0.8125rem;
      text-decoration: underline;
      cursor: pointer;

      &:hover {
        color: #4b5563;
      }
    }
  }

  .validation-error {
    margin: 0.75rem 0 0;
    color: #be123c;
    font-size: 0.875rem;
    font-weight: 500;
  }
`;
