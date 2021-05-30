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
import Button from './Button';

const CheckoutFormStyles = styled.div`
  margin: 0 auto;
  max-width: 26rem;
  width: 100%;

  .section {
    margin: 3rem 0;
  }

  .field-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(9rem, 1fr));
    gap: 0 1rem;
  }

  h3 {
    margin: 0 0 2rem;
    font-size: 1.125rem;
    font-weight: 600;
  }

  button {
    margin: 1.25rem 0 0;
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

  @media (max-width: 930px) {
    max-width: unset;

    .section:first-of-type {
      margin: 1.5rem 0 0;
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
  cardholderName: string;
};

type FieldItemProps = {
  name: keyof FormData;
  label: string;
};

type ErrorMessageProps = {
  name: keyof FormData;
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
        cardholderName: '',
      }}
      validationSchema={CheckoutSchema}
      onSubmit={handleSubmit}
    >
      <CheckoutFormStyles>
        <Form>
          <div className="section">
            <h3>1. Customer Information</h3>
            <div className="field-row">
              <FieldItem name="firstName" label="First Name" />
              <FieldItem name="lastName" label="Last Name" />
            </div>
            <FieldItem name="email" label="Email Address" />
          </div>
          <div className="section">
            <h3>2. Payment Details</h3>
            <FieldItem name="cardholderName" label="Name on card" />
            <label htmlFor="stripeInput">Card Information</label>
            <div className="stripe-input">
              <CardElement options={cardStyle} onChange={handleCardChange} />
            </div>
            {stripeError && <div className="stripe-error">{stripeError}</div>}
            <Button
              as="button"
              color="black"
              type="submit"
              disabled={!stripe || cartIsEmpty || isSubmitting}
            >
              {isSubmitting ? <LoadingSpinner /> : 'Submit your order'}
            </Button>

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
    </Formik>
  );
}
