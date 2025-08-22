import * as yup from 'yup';

export const gstRegex =
  /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/i;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Schema definition
export const baseSchema = yup.object().shape({
  firstname: yup
    .string()
    .min(2, 'Minimum 2 characters required.')
    .max(50, 'Maximum 50 characters allowed.')
    .matches(/^[A-Za-z]+$/, 'First name must contain only alphabets.')
    .required('First name is required'),
  lastname: yup
    .string()
    .min(2, 'Minimum 2 characters required.')
    .max(50, 'Maximum 50 characters allowed.')
    .matches(/^[A-Za-z]+$/, 'Last name must contain only alphabets.')
    .required('Last name is required'),
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegex, 'Invalid email address'),
  contact_no: yup
    .string()
    .min(10, 'Contact number must be a minimum of 10 digits')
    .required('Contact number is required'),
  profile_pic: yup.mixed().notRequired(),
  old_profile_pic: yup.string().notRequired(),
});

export const vendorSchema = yup.object().shape({
  business_name: yup
    .string()
    .required('Business Name is required')
    .matches(
      /^[A-Za-z0-9\s]+$/,
      'Business name must contain only alphanumeric characters and spaces.',
    )
    .min(2, 'Minimum 2 characters required.')
    .max(100, 'Maximum 100 characters allowed.'),
  gst_number: yup
    .string()
    .matches(gstRegex, 'Invalid GST number')
    .notRequired(),
  business_type: yup.string().required('Business Type is required'),
  business_email: yup
    .string()
    .email('Invalid business email')
    .required('Business Email is required'),
  business_contact: yup
    .string()
    .min(10, 'Business Contact must be a minimum of 10 digits')
    .required('Business Contact is required'),
  website_url: yup.string().url('Invalid website URL').notRequired(),
  business_address: yup
    .string()
    .required('Business Address is required')
    .max(200, 'Maximum 200 characters allowed.'),
});

export const agentSchema = yup.object().shape({
  address: yup.string().notRequired(),
});

export const signinSchema = yup.object().shape({
  email: yup
    .string()
    .required('Email is required')
    .matches(emailRegex, 'Invalid email address'),
  password: yup.string().required('Password is required'),
  remember: yup.boolean().notRequired(),
});

export const changePasswordSchema = yup.object().shape({
  old_password: yup.string().required('Current password is required'),
  newpassword: yup
    .string()
    .required('New Password is required')
    .test(
      'not-same-as-old',
      'New password must be different from the current password',
      function (value) {
        const { old_password } = this.parent;
        return value !== old_password;
      },
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('newpassword'), null], 'Passwords must match')
    .required('Confirm password is required'),
});
