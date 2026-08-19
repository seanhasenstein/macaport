import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { getTouchedErrors } from 'utils';
import { CheckoutForm } from '../../../../interfaces';
import TouchedError from './TouchedError';

export default function TouchedErrors({
  errors,
  touched,
}: {
  errors: FormikErrors<CheckoutForm>;
  touched: FormikTouched<CheckoutForm>;
}) {
  const [touchedErrors, setTouchedErrors] = React.useState<string[]>([]);

  React.useEffect(() => {
    // getTouchedErrors walks these recursively at runtime, so the generics
    // never line up with the CheckoutForm shape. Routing through unknown keeps
    // the cast explicit without changing behaviour.
    const testing = getTouchedErrors(
      errors as FormikErrors<string>,
      touched as unknown as FormikTouched<boolean>
    );
    setTouchedErrors(testing || []);
  }, [errors, touched]);

  if (touchedErrors.length > 0) {
    return (
      <div className="errors-list">
        <TouchedError name="customer.firstName" />
        <TouchedError name="customer.lastName" />
        <TouchedError name="customer.email" />
        <TouchedError name="customer.phone" />
        <TouchedError name="group" />
        <TouchedError name="shippingAddress.street" />
        <TouchedError name="shippingAddress.city" />
        <TouchedError name="shippingAddress.state" />
        <TouchedError name="shippingAddress.zipcode" />
        <TouchedError name="cardholderName" />
      </div>
    );
  } else {
    return null;
  }
}
