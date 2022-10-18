import React from 'react';
import { useRouter } from 'next/router';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import {
  PaymentMethodResult,
  StripeCardElementChangeEvent,
} from '@stripe/stripe-js';
import { CartItem, CheckoutForm } from 'interfaces';
import { useCart } from './useCart';

type ServerResponse = {
  success?: true;
  orderId?: string;
  storeClosed?: boolean;
  lowerInventory: boolean;
  lowerInventoryItems?: CartItem[];
  outOfStock: boolean;
  outOfStockItems?: CartItem[];
  verifiedItems: CartItem[];
  error?: string;
};

type Props = {
  storeId: string;
  storeName: string;
  primaryShippingAddress: {
    name: string;
    street: string;
    street2: string;
    city: string;
    state: string;
    zipcode: string;
  };
  setVerifiedItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setLowerInventoryItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setOutOfStockItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  setShowInventoryModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function useCheckoutSubmit(props: Props) {
  const router = useRouter();
  const elements = useElements();
  const stripe = useStripe();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverResponseError, setServerResponseError] =
    React.useState<string>();
  const [stripeError, setStripeError] = React.useState<string>();

  const { items, cartSubtotal, salesTax, cartTotal, cartIsEmpty, setItems } =
    useCart();

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    if (e.error) {
      setStripeError(e.error.message);
      return;
    }
    setStripeError(undefined);
  };

  const handleSubmit = async (data: CheckoutForm) => {
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
        name: data.cardholderName.trim(),
        email: data.customer.email.trim().toLowerCase(),
        phone: data.customer.phone.trim(),
      },
    });

    if (result) handlePaymentMethodResult(result, data);
  };

  const handlePaymentMethodResult = async (
    result: PaymentMethodResult,
    data: CheckoutForm
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
          storeId: props.storeId,
          storeName: props.storeName,
          payment_method_id: result.paymentMethod.id,
          items,
          customer: data.customer,
          group: data.group,
          shippingMethod: data.shippingMethod,
          shippingAddress:
            data.shippingMethod === 'Direct'
              ? data.shippingAddress
              : data.shippingMethod === 'Primary'
              ? props.primaryShippingAddress
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
    if (serverResponse.storeClosed === true) {
      router.push('/store-closed');
      return;
    }

    if (
      serverResponse.lowerInventory === true ||
      serverResponse.outOfStock === true
    ) {
      if (serverResponse.outOfStockItems) {
        props.setOutOfStockItems(serverResponse.outOfStockItems);
      }
      if (serverResponse.lowerInventoryItems) {
        props.setLowerInventoryItems(serverResponse.lowerInventoryItems);
      }
      props.setVerifiedItems(serverResponse.verifiedItems);
      setItems([
        ...serverResponse.verifiedItems,
        ...(serverResponse.lowerInventoryItems || []),
      ]);
      props.setShowInventoryModal(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (serverResponse.error) {
      setServerResponseError(serverResponse.error);
      console.error(serverResponse.error);
      setIsSubmitting(false);
      return;
    }

    setServerResponseError(undefined);
    router.push(
      `/store/${
        props.storeId
      }/order-confirmation?orderId=${serverResponse.orderId!}&emptyCart=true`
    );
  };

  return {
    cartIsEmpty,
    handleSubmit,
    handleCardChange,
    isSubmitting,
    serverResponseError,
    stripe,
    stripeError,
  };
}
