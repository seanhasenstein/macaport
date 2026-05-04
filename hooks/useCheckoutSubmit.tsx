import React from 'react';
import { useRouter } from 'next/router';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { StripeCardElementChangeEvent } from '@stripe/stripe-js';
import { CartItem, CheckoutForm, UseCheckoutSubmit } from 'interfaces';
import { useCart } from './useCart';
import { useTeacherAppreciation } from './useTeacherAppreciation';
import { useSwitchFitnessDiscount } from './useSwitchFitness';
import { useSheboyganLutheranStaff } from './useSheboyganLutheranStaff';

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
  sheboyganLutheranStaffId?: string;
  isSwitchFitnessStore: boolean;
  isEligibleForSheboyganLutheranStaffFromClient: boolean;
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

  // TODO: should I clean this up and bring in as a prop from the parent component?
  const {
    email: sheboyganLutheranStaffEmail,
    alreadyUsed: alreadyUsedForSheboyganLutheranStaff,
    isEligible: isEligibleForSheboyganLutheranStaff,
  } = useSheboyganLutheranStaff();
  // TODO: should I clean this up and bring in as a prop from the parent component?
  const { items, cartSubtotal, salesTax, cartTotal, cartIsEmpty, setItems } =
    useCart({
      sheboyganLutheranStaffEligible:
        !!props.sheboyganLutheranStaffId &&
        isEligibleForSheboyganLutheranStaff &&
        !alreadyUsedForSheboyganLutheranStaff,
    });

  const { resetState: resetSheboyganLutheranStaffDiscountState } =
    useSheboyganLutheranStaff();

  const {
    resetState: resetTeacherAppreciationState,
    email: teacherAppreciationEmail,
  } = useTeacherAppreciation();

  const {
    alreadyUsed: switchEmailAlreadyUsed,
    isEligible: switchEmailIsEligible,
    email: switchFitnessDiscountEmail,
    resetState: resetSwitchFitnessDiscountState,
  } = useSwitchFitnessDiscount();
  const isEligibleForSwitchDiscountFromClient =
    props.isSwitchFitnessStore &&
    switchEmailIsEligible &&
    !switchEmailAlreadyUsed;

  const handleCardChange = (e: StripeCardElementChangeEvent) => {
    if (e.error) {
      setStripeError(e.error.message);
      return;
    }
    setStripeError(undefined);
  };

  const handleSubmit = async (data: CheckoutForm) => {
    setIsSubmitting(true);

    let stripePaymentMethodResult: any;

    if (cartTotal > 0) {
      const cardElement = elements?.getElement(CardElement);

      if (!stripe || !cardElement) {
        console.log('Stripe.js has not yet loaded.');
        setStripeError(
          'An error has occured loading the page. Please refresh and try again.'
        );
        setIsSubmitting(false);
        return;
      }

      stripePaymentMethodResult = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: data.cardholderName.trim(),
          email: data.customer.email.trim().toLowerCase(),
          phone: data.customer.phone.trim(),
        },
      });

      if (stripePaymentMethodResult.error) {
        console.log(
          'Stripe payment method error:',
          stripePaymentMethodResult.error
        );
        setStripeError(stripePaymentMethodResult.error.message);
        setIsSubmitting(false);
        return;
      }
    }

    const response = await fetch('/api/submit-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        storeId: props.storeId,
        storeName: props.storeName,
        payment_method_id: stripePaymentMethodResult
          ? stripePaymentMethodResult.paymentMethod.id
          : '',
        items,
        customer: data.customer,
        group: data.group,
        shippingMethod: data.shippingMethod,
        shippingAddress:
          data.shippingMethod === 'Direct'
            ? data.shippingAddress
            : data.shippingMethod === 'Primary'
            ? props.primaryShippingAddress
            : data.shippingAddress,
        summary: {
          subtotal: cartSubtotal,
          shipping: 0,
          salesTax,
          total: cartTotal,
        },
        note: data.note ?? '',
        ...(teacherAppreciationEmail && { teacherAppreciationEmail }),
        ...(switchFitnessDiscountEmail && { switchFitnessDiscountEmail }),
        ...(isEligibleForSwitchDiscountFromClient && {
          isEligibleForSwitchDiscountFromClient,
        }),
        ...(sheboyganLutheranStaffEmail && { sheboyganLutheranStaffEmail }),
        ...(props.isEligibleForSheboyganLutheranStaffFromClient && {
          isEligibleForSheboyganLutheranStaffFromClient:
            props.isEligibleForSheboyganLutheranStaffFromClient,
        }),
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
      return;
    }

    setServerResponseError(undefined);

    if (res.resetTeacherAppreciation) {
      resetTeacherAppreciationState();
    }

    if (res.resetSwitchFitnessDiscount) {
      resetSwitchFitnessDiscountState();
    }

    if (res.resetSheboyganLutheranStaffDiscount) {
      resetSheboyganLutheranStaffDiscountState();
    }

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
