import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { CartProvider } from '../hooks/useCart';

const stripePromise = loadStripe(
  `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`
);

const mockElement = () => ({
  mount: jest.fn(),
  destroy: jest.fn(),
  on: jest.fn(),
  update: jest.fn(),
});

const mockElements = () => {
  const elements: { [key: string]: ReturnType<typeof mockElement> } = {};
  return {
    create: jest.fn(type => {
      elements[type] = mockElement();
      return elements[type];
    }),
    getElement: jest.fn(type => {
      return elements[type] || null;
    }),
  };
};

const mockStripe = () => ({
  elements: jest.fn(() => mockElements()),
  createToken: jest.fn(),
  createSource: jest.fn(),
  createPaymentMethod: jest.fn(),
  confirmCardPayment: jest.fn(),
  confirmCardSetup: jest.fn(),
  paymentRequest: jest.fn(),
  _registerWrapper: jest.fn(),
});

jest.mock('@stripe/react-stripe-js', () => {
  const stripe = jest.requireActual('@stripe/react-stripe-js');

  return {
    ...stripe,
    Element: () => {
      return mockElement;
    },
    useStripe: () => {
      return mockStripe;
    },
    useElements: () => {
      return mockElements;
    },
  };
});

jest.mock('../db', jest.fn());
jest.mock('next/router', () => require('next-router-mock'));

function render(ui: React.ReactElement) {
  return rtlRender(
    <Elements stripe={stripePromise}>
      <CartProvider cartId="test-cart">{ui}</CartProvider>
    </Elements>
  );
}

export * from '@testing-library/react';
export { render };
