import { FormikErrors, FormikTouched } from 'formik';
import React from 'react';
import { getTouchedErrors } from 'utils';
import { CheckoutForm } from '../../../../interfaces';
import ErrorItem from './TouchedError';

// Every validation message on a field the shopper has reached, gathered into
// one list above the submit button.
//
// The messages come from getTouchedErrors, which walks the whole error tree.
// This used to decide whether to show the box from that walk but then render
// a hand-written list of ten field names, so any validated field missing from
// that list produced an empty pink box: a submit that did nothing, with no
// way to find out which field was at fault. Rendering what the walk found
// means the two can never disagree, and a field added to the schema later is
// covered without anyone remembering this file.
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

  if (touchedErrors.length < 1) return null;

  return (
    <div className="errors-list">
      {touchedErrors.map((message, index) => (
        <ErrorItem key={`${message}-${index}`} message={message} />
      ))}
    </div>
  );
}
