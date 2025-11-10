import React from 'react';
import Image from 'next/image';
import { Formik, Form, Field } from 'formik';
import styled from 'styled-components';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

import { useSheboyganLutheranStaff } from 'hooks/useSheboyganLutheranStaff';

type Props = {
  sheboyganLutheranStaffId: string;
};

export default function SheboyganLutheranStaff({
  sheboyganLutheranStaffId,
}: Props) {
  const {
    email,
    isEligible,
    resetState,
    verifyEmail,
    notEligibleAlreadyUsed,
    notEligibleNotAlreadyUsed,
    isSubmitting,
  } = useSheboyganLutheranStaff();

  return (
    <SheboyganLutheranStaffStyles>
      <div>
        <div className="logo">
          <Image
            src="/images/sheboygan-lutheran-shield.webp"
            alt="Sheboygan Lutheran High School Shield"
            width={291}
            height={371}
          />
        </div>
        {!isEligible && !email ? (
          <h3 className="title">
            Are you a Sheboygan <br />
            Lutheran staff member?
          </h3>
        ) : null}
        {isEligible && email ? (
          <div className="email-is-eligible">
            <h3 className="title eligible-title">
              <CheckCircleIcon className="check-circle-icon" />
              Your credit has been applied!
            </h3>
            <p className="paragraph">You'll see your $75 credit at checkout.</p>
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
              Submit your <u>lutheranhigh.com</u> email to activate your $75
              apparel credit!
            </p>
            <Formik
              initialValues={{
                email: email ?? '',
              }}
              onSubmit={async (values, { resetForm }) => {
                const { isEligible } = await verifyEmail({
                  email: values.email,
                  sheboyganLutheranStaffId,
                });
                if (isEligible) {
                  resetForm();
                }
              }}
            >
              {() => (
                <Form>
                  <div className="field-item">
                    <label htmlFor="email">Email Address</label>
                    <Field
                      type="email"
                      name="email"
                      // placeholder="Enter your email"
                    />
                  </div>
                  <button
                    type="submit"
                    className="redeem-button"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <LoadingSpinner /> : 'Activate $75 Credit'}
                  </button>
                  {/* Message for not eligible but not used */}
                  {notEligibleNotAlreadyUsed ? (
                    <div className="validation-error">
                      This email address is not eligible.
                    </div>
                  ) : null}
                  {/* Message for not elibigle because already used */}
                  {notEligibleAlreadyUsed ? (
                    <div className="validation-error">
                      This email already used the credit.
                    </div>
                  ) : null}
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
    </SheboyganLutheranStaffStyles>
  );
}

const SheboyganLutheranStaffStyles = styled.div`
  margin: 0 auto;
  padding: 1.75rem 2rem 1.25rem;
  max-width: 22rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  text-align: center;

  .logo {
    width: 2.25rem;
    margin: 0 auto;
  }

  .title {
    margin: 1.5rem 0 0;
    color: #000;
    &.eligible-title {
      margin-bottom: 0.5rem;
      font-size: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      .check-circle-icon {
        margin-right: 0.25rem;
        flex-shrink: 0;
        height: 1.3125rem;
        width: 1.3125rem;
        color: #047857;
      }
    }
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
      background-color: rgba(0, 0, 0, 0.05);
      border: 1px solid rgba(0, 0, 0, 0.1);
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
      color: #31363f;
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

  @media (min-width: 768px) {
    padding-top: 1.125rem;
  }
`;

const LoadingSpinner = styled.span`
  @keyframes spinner {
    to {
      transform: rotate(360deg);
    }
  }

  &:before {
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
`;
