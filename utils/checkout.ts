import { removeNonDigits } from 'utils';
import * as Yup from 'yup';

export const cardStyle = {
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
      color: '#ab0202',
      iconColor: '#b91c1c',
    },
  },
};

interface GetInitialValues {
  requireGroupSelection: boolean;
  hasPrimaryShipping: boolean;
  allowDirectShipping: boolean;
  allowStorePickup: boolean;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function getInitialValues({
  requireGroupSelection,
  hasPrimaryShipping,
  allowDirectShipping,
  allowStorePickup,
  firstName,
  lastName,
  email,
}: GetInitialValues) {
  return {
    customer: {
      firstName: firstName || '',
      lastName: lastName || '',
      email: email || '',
      phone: '',
    },
    shippingAddress: {
      street: '',
      street2: '',
      city: '',
      state: '',
      zipcode: '',
    },
    groupRequired: requireGroupSelection,
    group: '',
    shippingMethod: hasPrimaryShipping
      ? ('Primary' as const)
      : allowStorePickup
      ? ('Store Pickup' as const)
      : allowDirectShipping
      ? ('Direct' as const)
      : ('Primary' as const), // todo: come back to this when adding in-store and custom shipping
    cardholderName: '',
    note: '',
  };
}

// Caps on free text. Nothing here is a security boundary, since every field
// is escaped where it is rendered; they stop a paste of a whole document
// reaching an order, a receipt email and the dashboard.
const NAME_MAX = 100;
const EMAIL_MAX = 200;
const ADDRESS_MAX = 200;
// Generous on purpose. A note here is often a roster: twenty players with
// names, numbers and sizes runs past a thousand characters, and that is a
// real order rather than an abuse of the field. The cap is only here to stop
// a pasted document.
const NOTE_MAX = 5000;

// requireCard is whether anything is owed once the member benefit has been
// applied. A cart the credit covers entirely has no card fields to fill in.
export function getCheckoutSchema(groupTerm: string, requireCard: boolean) {
  return Yup.object().shape({
    customer: Yup.object().shape({
      // Trimmed before the check, or a single space satisfies "required" and
      // the order arrives with a blank name once the server trims it.
      firstName: Yup.string()
        .trim()
        .max(NAME_MAX, 'First name is too long')
        .required('First name is required'),
      lastName: Yup.string()
        .trim()
        .max(NAME_MAX, 'Last name is too long')
        .required('Last name is required'),
      // A phone's suggested address arrives with a space after it, invisible
      // to the customer. submit-order trims before storing, so judge the
      // address the same way here rather than refusing a correct one.
      email: Yup.string()
        .trim()
        .max(EMAIL_MAX, 'Email address is too long')
        .email('A valid email is required')
        .required('An email address is required'),
      phone: Yup.string()
        .transform(value => {
          return removeNonDigits(value);
        })
        .matches(
          new RegExp(/^\d{10}$/),
          'A valid 10 digit phone number is required'
        )
        .required('A phone number is required'),
    }),
    group: Yup.string().when('groupRequired', {
      is: true,
      then: Yup.string().required(`A ${groupTerm} is required`),
    }),
    shippingAddress: Yup.object().when('shippingMethod', {
      is: 'Direct',
      then: Yup.object({
        street: Yup.string()
          .trim()
          .max(ADDRESS_MAX, 'Street is too long')
          .required('Street is required'),
        street2: Yup.string().trim().max(ADDRESS_MAX, 'Address is too long'),
        city: Yup.string()
          .trim()
          .max(ADDRESS_MAX, 'City is too long')
          .required('City is required'),
        state: Yup.string().required('State is required'),
        // Five digits, or five plus four. Required alone accepted "abc",
        // which is an order nobody can post.
        zipcode: Yup.string()
          .trim()
          .matches(/^\d{5}(-\d{4})?$/, 'A valid 5 digit zipcode is required')
          .required('Zipcode is required'),
      }),
    }),
    cardholderName: requireCard
      ? Yup.string()
          .trim()
          .max(NAME_MAX, "Cardholder's name is too long")
          .required("Cardholder's name is required")
      : Yup.string(),
    note: Yup.string().max(NOTE_MAX, 'Note is too long'),
  });
}

// What the browser last displayed as owed, in cents, as it arrives over the
// wire. Advisory and one-directional: the server uses it as a ceiling on
// what it may charge without asking again, never as a floor, so a browser
// cannot send a small number and pay less — it can only cause its own order
// to stop. Anything malformed, fractional or negative is treated as absent,
// which leaves the server free to charge its own figure as it did before.
export function expectedTotalFrom(body: { expectedTotal?: unknown }) {
  const value = body.expectedTotal;
  if (typeof value !== 'number') return null;
  if (!Number.isFinite(value) || !Number.isInteger(value)) return null;
  if (value < 0) return null;
  return value;
}
