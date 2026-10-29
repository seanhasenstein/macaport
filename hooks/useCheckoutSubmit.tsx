import React from 'react';
import { useRouter } from 'next/router';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { CartItem, CheckoutForm, UseCheckoutSubmit } from 'interfaces';
import { useCart } from './useCart';

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
  // What the priced cart says is owed. Decides whether a card is collected,
  // and is sent as a ceiling on what the server may charge. The server
  // still decides the price; this only stops a silent increase.
  total: number;
};

export default function useCheckoutSubmit(props: Props): UseCheckoutSubmit {
  const router = useRouter();
  const elements = useElements();
  const stripe = useStripe();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [serverResponseError, setServerResponseError] =
    React.useState<string>();
  const [stripeError, setStripeError] = React.useState<string>();
  const [verifiedItems, setVerifiedItems] = React.useState<CartItem[]>([]);
  const [lowerInventoryItems, setLowerInventoryItems] = React.useState<
    CartItem[]
  >([]);
  const [outOfStockItems, setOutOfStockItems] = React.useState<CartItem[]>([]);
  const [showInventoryModal, setShowInventoryModal] = React.useState(false);

  const { items, cartIsEmpty, setItems } = useCart();

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    if (e.error) {
      setStripeError(e.error.message);
      return;
    }
    setStripeError(undefined);
  };

  const handleSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);

    let paymentMethodId = '';

    if (props.total > 0) {
      const cardElement = elements?.getElement(CardElement);

      if (!stripe || !cardElement) {
        console.log('Stripe.js has not yet loaded.');
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

      if (result.error) {
        console.log('Stripe payment method error:', result.error);
        setStripeError(result.error.message);
        setIsSubmitting(false);
        return;
      }

      paymentMethodId = result.paymentMethod.id;
    }

    // Nothing about money goes up. The server re-prices every line from the
    // database and reads the member benefit from the session cookie, so
    // there is nothing here a browser could change to pay less.
    const response = await fetch('/api/submit-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId: props.storeId,
        storeName: props.storeName,
        payment_method_id: paymentMethodId,
        // The total on screen when this was submitted. The server still
        // prices the order itself; this only stops it charging more than
        // was displayed, which can happen if the benefit shrank while this
        // page was open.
        expectedTotal: props.total,
        items,
        customer: data.customer,
        group: data.group,
        shippingMethod: data.shippingMethod,
        shippingAddress:
          data.shippingMethod === 'Primary'
            ? props.primaryShippingAddress
            : data.shippingAddress,
        note: data.note ?? '',
      }),
    });

    const res = await response.json();

    if (res.storeClosed === true) {
      router.push('/store-closed');
      return;
    }

    if (res.lowerInventory || res.outOfStock) {
      if (res.outOfStockItems) {
        setOutOfStockItems(res.outOfStockItems);
      }
      if (res.lowerInventoryItems) {
        setLowerInventoryItems(res.lowerInventoryItems);
      }
      setVerifiedItems(res.verifiedItems);
      setItems([...res.verifiedItems, ...(res.lowerInventoryItems || [])]);
      setShowInventoryModal(true);
      setIsSubmitting(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (res.error) {
      setServerResponseError(res.error);
      console.error(res.error);
      setIsSubmitting(false);

      // What the page was showing is no longer true: another order used the
      // credit, the benefit was paused, or an item costs more than it did
      // when it went into the cart. Re-run the page's server props for the
      // benefit and shipping, and take the server's prices for the cart
      // itself, which server props do not cover. Without the second half a
      // price rise would be refused on every retry.
      if (res.benefitChanged) {
        if (res.verifiedItems) setItems(res.verifiedItems);
        router.replace(router.asPath);
      }
      return;
    }

    setServerResponseError(undefined);

    router.push(
      `/store/${props.storeId}/order-confirmation?orderId=${res.orderId}&emptyCart=true`
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
    verifiedItems,
    setVerifiedItems,
    lowerInventoryItems,
    setLowerInventoryItems,
    outOfStockItems,
    setOutOfStockItems,
    showInventoryModal,
    setShowInventoryModal,
  };
}
