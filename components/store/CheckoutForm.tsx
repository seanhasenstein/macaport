import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
  PaymentMethodResult,
  StripeCardElementChangeEvent,
} from '@stripe/stripe-js';
import {
  Formik,
  Form,
  Field,
  ErrorMessage as FormikErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { useCart } from '../../hooks/useCart';
import useHasMounted from '../../hooks/useHasMounted';
import { unitedStates } from '../../utils';

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
    z-index: 10;

    span {
      padding: 0 1.25rem;
      background-color: #f7f9fb;
    }

    &::after {
      content: '';
      position: absolute;
      top: 0.75rem;
      left: 0;
      height: 1px;
      width: 100%;
      background-color: #dddde2;
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
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #4f46e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    &:disabled {
      background-color: #434855;
      cursor: default;
    }
  }

  .stripe-input {
    margin: 0.375rem 0 0;
    padding: 0.625rem 0.75rem;
    background-color: #fff;
    border: 1px solid #dddde2;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
  }

  .stripe-error {
    margin: 0.375rem 0 0;
    font-size: 0.75rem;
    color: #de1d3b;
  }

  .empty-cart {
    margin: 0.875rem 0 0;
    font-size: 0.875rem;
    letter-spacing: -0.011em;
    color: #232c35;
    text-align: center;

    a {
      color: #3f6ed4;
      text-decoration: underline;
    }
  }
`;

const FieldItemStyles = styled.div`
  margin: 0 0 1.25rem;
  display: flex;
  flex-direction: column;
`;

const ErrorMessageStyles = styled.div`
  margin: 0.25rem 0 0;
  font-size: 0.75rem;
  color: #de1d3b;
`;

const cardStyle = {
  style: {
    base: {
      color: '#36383e',
      fontFamily: 'Inter, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '14px',
      '::placeholder': {
        color: '#36383e',
      },
    },
    invalid: {
      color: '#bc1e1e',
      iconColor: '#bc1e1e',
    },
  },
};

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

type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  shippingAddress: {
    address1: string;
    address2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  shippingMethod: 'NONE' | 'PRIMARY' | 'CUSTOM';
  billingShippingSameAddress: boolean;
  cardholderName: string;
};

type FieldItemProps = {
  name: string;
  label: string;
};

type ErrorMessageProps = {
  name: string;
};

type ServerResponse = {
  success?: true;
  orderId?: string;
  error?: string;
};

const CheckoutSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  cardholderName: Yup.string().required("Cardholder's name is required"),
});

function FieldItem({ name, label }: FieldItemProps) {
  return (
    <FieldItemStyles>
      <label htmlFor={name}>{label}</label>
      <Field id={name} name={name} />
      <ErrorMessage name={name} />
    </FieldItemStyles>
  );
}

function ErrorMessage({ name }: ErrorMessageProps) {
  return (
    <FormikErrorMessage
      name={name}
      render={msg => <ErrorMessageStyles>{msg}</ErrorMessageStyles>}
    />
  );
}

export default function CheckoutForm() {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const {
    items,
    cartSubtotal,
    transactionFee,
    cartTotal,
    cartIsEmpty,
    emptyCart,
  } = useCart();
  const [stripeError, setStripeError] = React.useState<string>();
  const [serverResponseError, setServerResponseError] =
    React.useState<string>();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const stripe = useStripe();
  const elements = useElements();

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    if (e.error) {
      setStripeError(e.error.message);
      return;
    }
    setStripeError(undefined);
  };

  const handleSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    const cardElement = elements?.getElement(CardElement);

    if (!stripe || !cardElement) {
      setStripeError(
        'An error has occured loading the page. Please refresh and try again.'
      );
      setIsSubmitting(false);
      return;
    }

    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: data.cardholderName,
        email: data.email,
      },
    });

    if (result) handlePaymentMethodResult(result, data);
  };

  const handlePaymentMethodResult = async (
    result: PaymentMethodResult,
    data: FormData
  ) => {
    if (result.error) {
      setStripeError(result.error.message);
      setIsSubmitting(false);
      return;
    } else {
      // Don't want cardholderName in db
      // eslint-disable-next-line
      const { cardholderName, ...customer } = data;
      const response = await fetch('/api/stripe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_method_id: result.paymentMethod.id,
          items,
          customer,
          summary: {
            subtotal: cartSubtotal,
            transactionFee,
            total: cartTotal,
          },
        }),
      });

      const serverResponse = await response.json();

      handleServerResponse(serverResponse);
    }
  };

  const handleServerResponse = (serverResponse: ServerResponse) => {
    if (serverResponse.error) {
      setServerResponseError(serverResponse.error);
      console.error(serverResponse.error);
      setIsSubmitting(false);
    } else {
      setServerResponseError(undefined);
      emptyCart();
      router.push(
        `/demo-store/order-confirmation?id=${serverResponse.orderId!}`
      );
    }
  };

  return (
    <Formik
      initialValues={{
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        shippingAddress: {
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipcode: '',
        },
        // TODO: Set shippingMethod value from database store settings
        shippingMethod: 'PRIMARY',
        billingShippingSameAddress: true,
        billingAddress: {
          address1: '',
          address2: '',
          city: '',
          state: '',
          zipcode: '',
        },
        cardholderName: '',
      }}
      validationSchema={CheckoutSchema}
      onSubmit={handleSubmit}
    >
      {({ values }: { values: FormData }) => (
        <CheckoutFormStyles>
          <Form>
            <div className="section">
              <h3 className="section-title">
                <span>Shipping Details</span>
              </h3>
              <div className="field-row">
                <FieldItem name="firstName" label="First Name" />
                <FieldItem name="lastName" label="Last Name" />
              </div>
              <FieldItem name="email" label="Email Address" />
              <FieldItem name="phone" label="Phone Number" />
              <h4>Choose a shipping method:</h4>
              <div className="radio-shipping-group">
                <div
                  className={`radio-shipping-item ${
                    values.shippingMethod === 'PRIMARY' ? 'checked' : ''
                  }`}
                >
                  <label htmlFor="primaryShipping">
                    <Field
                      type="radio"
                      name="shippingMethod"
                      id="primaryShipping"
                      value="PRIMARY"
                    />
                    <div>Pick up at New London HS</div>
                    <div className="shipping-price">Free</div>
                  </label>
                </div>
                <div
                  className={`radio-shipping-item ${
                    values.shippingMethod === 'CUSTOM' ? 'checked' : ''
                  }`}
                >
                  <label htmlFor="secondaryShipping">
                    <Field
                      type="radio"
                      name="shippingMethod"
                      id="secondaryShipping"
                      value="CUSTOM"
                    />
                    <div>Ship directly to you</div>
                    <div className="shipping-price">$4.99</div>
                  </label>
                </div>
              </div>
              {values.shippingMethod === 'CUSTOM' && (
                <div>
                  <FieldItem
                    name="shippingAddress.address1"
                    label="Street Address"
                  />
                  <FieldItem
                    name="shippingAddress.address2"
                    label="Address Line 2"
                  />
                  <div className="field-row">
                    <FieldItem name="shippingAddress.city" label="City" />
                    <FieldItemStyles>
                      <label htmlFor="shippingAddress.state">State</label>
                      <Field name="shippingAddress.state" as="select">
                        <option value="default">Select state</option>
                        {unitedStates.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </Field>
                    </FieldItemStyles>
                  </div>
                  <FieldItem name="shippingAddress.zipcode" label="Zipcode" />
                </div>
              )}
            </div>
            <div className="section">
              <h3 className="section-title">
                <span>Billing Details</span>
              </h3>
              {values.shippingMethod === 'CUSTOM' && (
                <div className="checkbox-item">
                  <Field
                    type="checkbox"
                    name="billingShippingSameAddress"
                    id="billingShippingSameAddress"
                  />
                  <label htmlFor="billingShippingSameAddress">
                    Billing and shipping address are the same
                  </label>
                </div>
              )}
              <FieldItem name="cardholderName" label="Cardholder's Name" />
              {!values.billingShippingSameAddress ||
              (values.shippingMethod !== 'CUSTOM' &&
                values.billingShippingSameAddress) ? (
                <div>
                  <FieldItem
                    name="billingAddress.address1"
                    label="Street Address"
                  />
                  <FieldItem
                    name="billingAddress.address2"
                    label="Address Line 2"
                  />
                  <div className="field-row">
                    <FieldItem name="billingAddress.city" label="City" />
                    <FieldItemStyles>
                      <label htmlFor="billingAddress.state">State</label>
                      <Field name="billingAddress.state" as="select">
                        <option value="default">Select your state</option>
                        {unitedStates.map((s, i) => (
                          <option key={i} value={s}>
                            {s}
                          </option>
                        ))}
                      </Field>
                    </FieldItemStyles>
                  </div>
                  <FieldItem name="billingAddress.zipcode" label="Zipcode" />
                </div>
              ) : null}
              <label htmlFor="stripeInput">Card Information</label>
              <div className="stripe-input">
                <CardElement options={cardStyle} onChange={handleCardChange} />
              </div>
              {stripeError && <div className="stripe-error">{stripeError}</div>}
              <button
                type="submit"
                disabled={!stripe || cartIsEmpty || isSubmitting}
              >
                {isSubmitting ? <LoadingSpinner /> : 'Place your order'}
              </button>

              {serverResponseError && (
                <div className="stripe-error">{serverResponseError}</div>
              )}
              {hasMounted && cartIsEmpty && !isSubmitting && (
                <div className="empty-cart">
                  Your cart is empty.{' '}
                  <Link href="/demo-store">
                    <a>Go to add items</a>
                  </Link>
                  .
                </div>
              )}
            </div>
          </Form>
        </CheckoutFormStyles>
      )}
    </Formik>
  );
}
