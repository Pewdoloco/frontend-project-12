import React, { useState } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Alert, Button, Form as BootstrapForm } from 'react-bootstrap';
import { toast } from 'react-toastify';
import './Signup.css';
import { useTranslation } from 'react-i18next';

const TextInput = ({label, ...props }) => {
  const [field, meta] = useField(props);
  const { t } = useTranslation();
  return (
    <BootstrapForm.Group className="mb-3">
      <BootstrapForm.Control 
      {...field} 
      {...props}
      placeholder={t(label)}
      isInvalid={meta.touched && meta.error} 
      />
      {meta.touched && meta.error ? (
        <div className="text-danger mt-1">{t(meta.error)}</div>
      ) : null}
    </BootstrapForm.Group>
  );
};

function Signup() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'signup.nameLength')
      .max(20, 'signup.nameLength')
      .required('modals.required'),
    password: Yup.string()
      .min(6, 'signup.minPasswordLength')
      .required('modals.required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'signup.passwordMatch')
      .required('modals.required'),
  });

  return (
    <div className="signup-container">
      <h1>{t('signup.title')}</h1>
      {error && <Alert variant="danger">{t(error)}</Alert>}
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          try {
            const response = await axios.post('/api/v1/signup', {
              username: values.username,
              password: values.password,
            });
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            setError(null);
            toast.success(t('signup.success'));
            navigate('/');
          } catch (err) {
            if (err.response?.status === 409) {
              setError('signup.userExists');
            } else {
              setError('signup.registrationFailed');
            }
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="signup-form">
            <TextInput
              label="signup.username"
              name="username"
              type="text"
              placeholder={t('signup.username')}
              disabled={isSubmitting}
            />
            <TextInput
              label="signup.password"
              name="password"
              type="password"
              placeholder={t('signup.password')}
              disabled={isSubmitting}
            />
            <TextInput
              label="signup.confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder={t('signup.confirmPassword')}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-100"
            >
              {t('signup.signup')}
            </Button>
            <div className="text-center mt-3">
              {t('signup.haveAccount')}<Link to="/login">{t('signup.login')}</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;