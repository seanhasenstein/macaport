import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { CheckCircleIcon } from '@heroicons/react/20/solid';

import { useCart } from 'hooks/useCart';
import { useSwitchFitnessDiscount } from 'hooks/useSwitchFitness';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please provide a valid email address.')
    .required('Email address is required.'),
});

type Props = { switchFitnessId: string };

export default function SwitchFitness({ switchFitnessId }: Props) {
  const [isLoading, setIsLoading] = React.useState(false);

  const { items, setItems, updateStoreSettings } = useCart();
  const { alreadyUsed, email, isEligible, resetState, verifyEmail } =
    useSwitchFitnessDiscount();

  const notEligibleNotAlreadyUsed = email && !isEligible && !alreadyUsed;
  const notEligibleAlreadyUsed = email && !isEligible && alreadyUsed;

  const resetCartWithUpdatedStoreSettings = () => {
    setItems(items);
  };

  return (
    <SwitchFitnessStyles>
      <div>
        <Image
          src="/images/switch-fitness-logo.png"
          alt="Switch Fitness"
          width={32}
          height={32}
          className="logo"
          quality={100}
        />
        <h3 className="title">Switch Fitness Promotion</h3>
        {isEligible && email ? (
          <div className="email-is-eligible">
            <CheckCircleIcon className="check-circle-icon" />
            <p className="paragraph">
              You're eligible for $25 off!
              <br />
              This discount will be applied at checkout.
            </p>
            <div className="current-email">
              <p className="email-label">Your verified email</p>
              <p className="email">{email}</p>
            </div>
            <button
              type="button"
              className="reset-discount-button"
              onClick={() => {
                resetState();
                updateStoreSettings({
                  isSwitchFitnessStore: true,
                  applySwitchFitnessDiscount: false,
                });
                resetCartWithUpdatedStoreSettings();
              }}
            >
              Remove this discount
            </button>
          </div>
        ) : (
          <>
            <p className="instructions">
              We're excited to offer $25 off of Switch Fitness apparel. Enter a
              verified email address to redeem.
            </p>
            <Formik
              validationSchema={validationSchema}
              initialValues={{
                email: email ?? '',
              }}
              onSubmit={async (values, { resetForm }) => {
                setIsLoading(true);
                const {
                  isEligible: isEligibleResponse,
                  alreadyUsed: alreadyUsedResponse,
                } = await verifyEmail({
                  email: values.email,
                  switchFitnessId,
                });
                if (isEligibleResponse && !alreadyUsedResponse) {
                  resetForm();
                  updateStoreSettings({
                    isSwitchFitnessStore: true,
                    applySwitchFitnessDiscount: true,
                  });
                  resetCartWithUpdatedStoreSettings();
                }
                setIsLoading(false);
              }}
            >
              {({ errors, setFieldValue, submitCount }) => (
                <Form>
                  <div className="field-item">
                    <label htmlFor="email">Email Address</label>
                    <Field
                      type="email"
                      name="email"
                      placeholder="Enter your email address"
                      className="email-input"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (
                          notEligibleNotAlreadyUsed ||
                          notEligibleAlreadyUsed
                        ) {
                          resetState();
                        }
                        setFieldValue('email', e.target.value.toLowerCase());
                      }}
                    />
                  </div>
                  <button type="submit" className="redeem-button">
                    {isLoading ? <LoadingSpinner /> : 'Apply the discount'}
                  </button>
                  {(errors.email &&
                    errors.email !== 'Email address is required.') ||
                  (errors.email === 'Email address is required.' &&
                    submitCount > 0) ? (
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="validation-error"
                    />
                  ) : null}
                  {notEligibleNotAlreadyUsed && !errors.email ? (
                    <div className="validation-error">
                      This email is not eligible.
                    </div>
                  ) : null}
                  {notEligibleAlreadyUsed && !errors.email ? (
                    <div className="validation-error">
                      This email was already used.
                    </div>
                  ) : null}
                </Form>
              )}
            </Formik>
          </>
        )}
      </div>
      <p className="disclaimer">
        Promotion only valid one time per email address unless granted again
        from both Switch Fitness and Macaport. This promotion does not apply to
        sales tax or shipping costs.
      </p>
    </SwitchFitnessStyles>
  );
}

const SwitchFitnessStyles = styled.div`
  position: relative;
  margin: 0 auto;
  padding: 2rem 2rem 6.5rem;
  max-width: 22rem;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  background-color: #fff;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  text-align: center;

  .logo {
    width: 2.75rem;
    height: 2.75rem;
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
    color: #52525b;
  }

  .field-item {
    margin: 1.5rem 0 0;
    display: flex;
    flex-direction: column;

    label {
      margin: 0 0 0.625rem;
      text-align: left;
      font-size: 0.75rem;
    }
  }

  .redeem-button {
    margin: 1rem 0 0;
    width: 100%;
    padding: 0.75rem 1.25rem;
    width: 100%;
    height: 2.25rem;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #27272a;
    color: #f3f4f5;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.011em;
    border: none;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
      background-color: #18181b;
      color: #fff;
    }
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
      background-color: #f0f1f4;
      border: 1px solid #e5e6ec;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      border-radius: 0.375rem;
      width: 100%;
    }
    .email-label {
      margin: 0;
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #18181b;
      line-height: 120%;
    }
    .email {
      margin: 0.5rem 0 0;
      word-wrap: break-word;
      max-width: 17.375rem;
      line-height: 120%;
      font-size: 0.8125rem;
      color: #3f3f46;
    }
    .reset-discount-button {
      margin: 0.875rem 0 0;
      padding: 0;
      background-color: transparent;
      border: none;
      color: #52525b;
      font-size: 0.75rem;
      text-decoration: underline;
      cursor: pointer;
      transition: color 0.2s ease;
      &:hover {
        color: #181a1e;
      }
    }
  }

  .validation-error {
    margin: 0;
    position: absolute;
    bottom: 4.75rem;
    left: 0;
    right: 0;
    color: #be123c;
    font-size: 0.8125rem;
    font-weight: 500;
  }

  .disclaimer {
    padding: 0 2rem;
    position: absolute;
    left: 0;
    bottom: 1rem;
    font-size: 0.625rem;
    text-align: center;
    color: #71717a;
  }

  @media (min-width: 768px) {
    padding-top: 1.5rem;
    padding-bottom: 6rem;
    .field-item {
      .email-input {
        font-size: 0.8125rem;
      }
    }
    .validation-error {
      bottom: 4.75rem;
    }
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
