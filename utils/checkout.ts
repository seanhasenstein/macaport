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
  cartTotal: number;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export function getInitialValues({
  requireGroupSelection,
  hasPrimaryShipping,
  allowDirectShipping,
  allowStorePickup,
  cartTotal,
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
    cartTotal,
  };
}

export function getCheckoutSchema(groupTerm: string) {
  return Yup.object().shape({
    customer: Yup.object().shape({
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string()
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
    cardholderName: Yup.string().when('cartTotal', {
      is: (cartTotal: number) => cartTotal > 0,
      then: Yup.string().required("Cardholder's name is required"),
    }),
  });
}
