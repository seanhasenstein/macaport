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

// requireCard is whether anything is owed once the member benefit has been
// applied. A cart the credit covers entirely has no card fields to fill in.
export function getCheckoutSchema(groupTerm: string, requireCard: boolean) {
  return Yup.object().shape({
    customer: Yup.object().shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      // A phone's suggested address arrives with a space after it, invisible
      // to the customer. submit-order trims before storing, so judge the
      // address the same way here rather than refusing a correct one.
      email: Yup.string()
        .trim()
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
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        zipcode: Yup.string().required('Zipcode is required'),
      }),
    }),
    cardholderName: requireCard
      ? Yup.string().required("Cardholder's name is required")
      : Yup.string(),
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
