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
import { unitedStates, removeNonDigits } from '../../utils';
import { useCart } from '../../hooks/useCart';
import useHasMounted from '../../hooks/useHasMounted';

type FormProps = {
  customer: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  shippingMethod: 'Primary' | 'Direct' | 'None';
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
  customer: Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string()
      .transform(value => {
        return removeNonDigits(value);
      })
      .matches(
        new RegExp(/^\d{10}$/),
        'Phone number must be 10 digits (123) 456-7890'
      )
      .required('Phone number is required'),
  }),
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

type Props = {
  storeId: string;
  storeName: string;
  allowDirectShipping: boolean;
  primaryShippingAddress: {
    name: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
};

export default function CheckoutForm({
  storeId,
  storeName,
  allowDirectShipping,
  primaryShippingAddress,
}: Props) {
  const hasMounted = useHasMounted();
  const router = useRouter();
  const { items, cartSubtotal, salesTax, cartTotal, cartIsEmpty, emptyCart } =
    useCart();
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

  const handleSubmit = async (data: FormProps) => {
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
        email: data.customer.email,
        phone: data.customer.phone,
      },
    });

    if (result) handlePaymentMethodResult(result, data);
  };

  const handlePaymentMethodResult = async (
    result: PaymentMethodResult,
    data: FormProps
  ) => {
    if (result.error) {
      setStripeError(result.error.message);
      setIsSubmitting(false);
      return;
    } else {
      const response = await fetch('/api/stripe-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          storeName,
          payment_method_id: result.paymentMethod.id,
          items,
          customer: data.customer,
          shippingMethod: data.shippingMethod,
          shippingAddress:
            data.shippingMethod === 'Direct'
              ? data.shippingAddress
              : data.shippingMethod === 'Primary'
              ? primaryShippingAddress
              : undefined,
          summary: {
            subtotal: cartSubtotal,
            shipping: 0,
            salesTax,
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
        `/store/${storeId}/order-confirmation?orderId=${serverResponse.orderId!}`
      );
    }
  };

  return (
    <Formik
      initialValues={{
        customer: {
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
        },
        shippingAddress: {
          street: '',
          street2: '',
          city: '',
          state: '',
          zipcode: '',
        },
        shippingMethod: 'Primary',
        cardholderName: '',
      }}
      validationSchema={CheckoutSchema}
      onSubmit={handleSubmit}
    >
      {({ values }: { values: FormProps }) => (
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
              <h4>Choose a shipping method:</h4>
              <div className="radio-shipping-group">
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
                    <div>Pick up at {primaryShippingAddress.name}</div>
                    <div className="shipping-price">Free</div>
                  </label>
                </div>
                {allowDirectShipping && (
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
              <FieldItem name="cardholderName" label="Cardholder's Name" />
              <label htmlFor="stripeInput">Card Information</label>
              <div className="stripe-input">
                <CardElement options={cardStyle} onChange={handleCardChange} />
              </div>
              {stripeError && <div className="stripe-error">{stripeError}</div>}
              <button
                type="submit"
                disabled={!stripe || cartIsEmpty || isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner />
                ) : cartIsEmpty ? (
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

              {serverResponseError && (
                <div className="stripe-error">{serverResponseError}</div>
              )}
              {hasMounted && cartIsEmpty && !isSubmitting && (
                <div className="empty-cart">
                  Your order is empty.{' '}
                  <Link href={`/store/${storeId}`}>
                    <a>Continue shopping</a>
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
    }

    &:focus-visible {
      box-shadow: rgb(255, 255, 255) 0px 0px 0px 2px, #4f46e5 0px 0px 0px 4px,
        rgba(0, 0, 0, 0.05) 0px 1px 2px 0px;
    }

    &:disabled {
      background-color: #434855;
      cursor: default;
    }

    svg {
      height: 1.25rem;
      width: 1.25rem;
      color: rgba(255, 255, 255, 0.5);
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
      display: inline-flex;
      align-items: center;
      color: #4f46e5;
      text-decoration: underline;

      &:hover {
        color: #4338ca;
      }
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
  font-weight: 500;
  color: #b91c1c;
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
