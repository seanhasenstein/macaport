import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { CardElement } from '@stripe/react-stripe-js';
import { Formik, Form, Field } from 'formik';
import { CartItem } from '../../../interfaces';
import { unitedStates } from '../../../utils';
import useHasMounted from '../../../hooks/useHasMounted';
import FieldItem, { FieldItemStyles } from './form/FieldItem';
import ErrorMessage from './form/ErrorMessage';
import TouchedErrors from './form/TouchedErrors';
import useCheckoutSubmit from 'hooks/useCheckoutSubmit';
import { cardStyle, getCheckoutSchema, getInitialValues } from 'utils/checkout';

type Props = {
  storeId: string;
  storeName: string;
  allowDirectShipping: boolean;
  hasPrimaryShipping: boolean;
  primaryShippingAddress: {
    name: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  requireGroupSelection: boolean;
  groupTerm: string;
  groups: string[];
  setVerifiedItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setLowerInventoryItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setOutOfStockItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setShowInventoryModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function CheckoutForm(props: Props) {
  const hasMounted = useHasMounted();
  const checkout = useCheckoutSubmit(props);
  const [initialValues] = React.useState(() =>
    getInitialValues({
      requireGroupSelection: props.requireGroupSelection,
      hasPrimaryShipping: props.hasPrimaryShipping,
      allowDirectShipping: props.allowDirectShipping,
    })
  );

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={getCheckoutSchema(props.groupTerm)}
      onSubmit={checkout.handleSubmit}
    >
      {({ values, errors, touched }) => (
        <CheckoutFormStyles>
          <Form>
            <div className="section">
              <h3 className="section-title">
                <span>Shipping Details</span>
              </h3>
              <div className="field-row">
                <FieldItem name="customer.firstName" label="First Name" />
                <FieldItem name="customer.lastName" label="Last Name" />
              </div>
              <FieldItem name="customer.email" label="Email Address" />
              <FieldItem name="customer.phone" label="Phone Number" />
              {props.requireGroupSelection && (
                <div className="field-row">
                  <FieldItemStyles>
                    <label htmlFor="group" className="capitlize">
                      {props.groupTerm}
                    </label>
                    <Field name="group" as="select">
                      <option value="">
                        Select your {props.groupTerm.toLowerCase()}
                      </option>
                      {props.groups.map((g, i) => (
                        <option key={i} value={g}>
                          {g}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="group" />
                  </FieldItemStyles>
                </div>
              )}
              {(props.hasPrimaryShipping || props.allowDirectShipping) && (
                <>
                  <h4>Choose a shipping method:</h4>
                  <div className="radio-shipping-group">
                    {props.hasPrimaryShipping && (
                      <div
                        className={`radio-shipping-item ${
                          values.shippingMethod === 'Primary' ? 'checked' : ''
                        }`}
                      >
                        <label htmlFor="primaryShipping">
                          <Field
                            type="radio"
                            name="shippingMethod"
                            id="primaryShipping"
                            value="Primary"
                          />
                          <div>
                            Pick up at {props.primaryShippingAddress.name}
                          </div>
                          <div className="shipping-price">Free</div>
                        </label>
                      </div>
                    )}
                    {props.allowDirectShipping && (
                      <div
                        className={`radio-shipping-item ${
                          values.shippingMethod === 'Direct' ? 'checked' : ''
                        }`}
                      >
                        <label htmlFor="secondaryShipping">
                          <Field
                            type="radio"
                            name="shippingMethod"
                            id="secondaryShipping"
                            value="Direct"
                          />
                          <div>Ship directly to you</div>
                          <div className="shipping-price">$0.00</div>
                        </label>
                      </div>
                    )}
                  </div>
                  {values.shippingMethod === 'Direct' && (
                    <div>
                      <FieldItem
                        name="shippingAddress.street"
                        label="Street Address"
                      />
                      <FieldItem
                        name="shippingAddress.street2"
                        label="Address Line 2"
                      />
                      <div className="field-row">
                        <FieldItem name="shippingAddress.city" label="City" />
                        <FieldItemStyles>
                          <label htmlFor="shippingAddress.state">State</label>
                          <Field name="shippingAddress.state" as="select">
                            <option value="">Select state</option>
                            {unitedStates.map((s, i) => (
                              <option key={i} value={s}>
                                {s}
                              </option>
                            ))}
                          </Field>
                          <ErrorMessage name="shippingAddress.state" />
                        </FieldItemStyles>
                      </div>
                      <FieldItem
                        name="shippingAddress.zipcode"
                        label="Zipcode"
                      />
                    </div>
                  )}
                </>
              )}
            </div>
            <div className="section">
              <h3 className="section-title">
                <span>Billing Details</span>
              </h3>
              <FieldItem name="cardholderName" label="Cardholder's Name" />
              <label htmlFor="stripeInput">Card Information</label>
              <CardElement
                options={cardStyle}
                onChange={checkout.handleCardChange}
              />
              {checkout.stripeError && (
                <div className="stripe-error">{checkout.stripeError}</div>
              )}
              <button
                type="submit"
                disabled={
                  !checkout.stripe ||
                  checkout.cartIsEmpty ||
                  checkout.isSubmitting
                }
              >
                {checkout.isSubmitting ? (
                  <LoadingSpinner />
                ) : checkout.cartIsEmpty ? (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    <span className="sr-only">Your order is empty</span>
                  </>
                ) : (
                  'Place your order'
                )}
              </button>
              {checkout.serverResponseError && (
                <div className="stripe-error">
                  {checkout.serverResponseError}
                </div>
              )}
              {hasMounted && checkout.cartIsEmpty && !checkout.isSubmitting && (
                <div className="empty-cart">
                  Your order is empty.{' '}
                  <Link href={`/store/${props.storeId}`}>
                    <a>Continue shopping</a>
                  </Link>
                  .
                </div>
              )}
              <TouchedErrors errors={errors} touched={touched} />
            </div>
          </Form>
        </CheckoutFormStyles>
      )}
    </Formik>
  );
}

const CheckoutFormStyles = styled.div`
  .section {
    margin: 4rem 0;
  }

  .field-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(11rem, 1fr));
    gap: 0 1rem;
  }

  h4 {
    margin: 2rem 0 0.75rem;
    font-size: 0.8125rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.0375em;
    color: #6b7280;
  }

  .radio-shipping-group {
    margin: 0 0 2rem;
    background-color: #fff;
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .radio-shipping-item {
    border: 1px solid #dddde2;
    position: relative;

    &.checked {
      background-color: #eef2ff;
      border-color: #c7d2fe;
      z-index: 100;

      label {
        color: #3730a3;
      }
    }

    &:first-of-type {
      border-top-left-radius: 0.375rem;
      border-top-right-radius: 0.375rem;
    }

    &:last-of-type {
      margin-top: -1px;
      border-bottom-left-radius: 0.375rem;
      border-bottom-right-radius: 0.375rem;
    }

    label {
      margin: 0;
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      line-height: 1;
      cursor: pointer;
    }

    input {
      margin-right: 1rem;
    }

    .shipping-price {
      margin-left: auto;
    }
  }

  .checkbox-item {
    margin: 0 0 1.5rem;

    input {
      margin: 0 0.75rem 0 0;
    }
  }

  .section-title {
    margin: 0 0 2rem;
    position: relative;
    font-size: 1.125rem;
    font-weight: 600;
    text-align: center;
    text-transform: capitalize;
    z-index: 10;

    span {
      padding: 0 1.25rem;
      background-color: #f3f4f6;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0.75rem;
      left: 0;
      height: 1px;
      width: 100%;
      background-color: #d1d5db;
      z-index: -1;
    }
  }

  button {
    margin: 1.75rem 0 0;
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
    border-radius: 0.375rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    cursor: pointer;

    &:hover:not(:disabled) {
      background-color: #3a3f4a;
    }

    &:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #4f46e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    &:disabled {
      cursor: default;
      pointer-events: none;
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
      color: #777b82;
    }
  }

  .StripeElement {
    margin: 0.375rem 0 0;
    padding: 0.625rem 0.75rem;
    background-color: #fff;
    border: 1px solid #dddde2;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .StripeElement--focus {
    box-shadow: rgb(255, 255, 255) 0px 0px 0px 0px, #1f30c2 0px 0px 0px 1px,
      rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    border: 1px solid #1f30c2;
  }

  .stripe-error {
    margin: 0.375rem 0 0;
    font-size: 0.75rem;
    font-weight: 500;
    color: #b91c1c;
  }

  .empty-cart {
    margin: 0.875rem 0 0;
    font-size: 0.875rem;
    letter-spacing: -0.011em;
    color: #232c35;
    text-align: center;

    a {
      display: inline-flex;
      align-items: center;
      color: #303eb1;
      text-decoration: underline;

      &:hover {
        color: #1629cb;
      }
    }
  }

  .capitlize {
    text-transform: capitalize;
  }

  .errors-list {
    margin: 1rem 0 0;
    padding: 0.875rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    background-color: #fef2f2;
    border-radius: 0.375rem;
    border: 1px solid #fee2e2;
    box-shadow: inset 0 1px 1px #fff, 0 1px 2px 0 rgb(0 0 0 / 0.05);

    .error-item {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.75rem;
      font-weight: 500;
      color: #991b1b;

      svg {
        height: 0.875rem;
        width: 0.875rem;
        color: #b91c1c;
      }
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
