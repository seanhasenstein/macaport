import * as Yup from 'yup';
import { ContactFormValues } from 'interfaces';
import { removeNonDigits } from 'utils';

export const initialValues: ContactFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  message: '',
  honeypot: '',
};

export const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string()
    .email('A valid email is required')
    .required('Email address is required'),
  phone: Yup.string()
    .transform(value => {
      return removeNonDigits(value);
    })
    .matches(new RegExp(/^\d{10}$/), 'Phone number must be 10 digits')
    .required('Phone number is required'),
  message: Yup.string().required('A message is required'),
});
