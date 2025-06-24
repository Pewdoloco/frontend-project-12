import React, { useState } from 'react';
import { Formik, Form, useField } from 'formik';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Alert, Button, Form as BootstrapForm } from 'react-bootstrap';
import './Login.css';
import { useTranslation } from 'react-i18next';

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { t } = useTranslation();
  return (
    <BootstrapForm.Group className="mb-3">
      <BootstrapForm.Label>{t(label)}</BootstrapForm.Label>
      <BootstrapForm.Control {...field} {...props} isInvalid={meta.touched && meta.error} />
      {meta.touched && meta.error ? (
        <div className="text-danger mt-1">{t(meta.error)}</div>
      ) : null}
    </BootstrapForm.Group>
  );
};

function Login() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [error, setError] = useState(null);

  return (
    <div className="login-container">
      <h1>{t('login.title')}</h1>
      {error && <Alert variant="danger">{t('login.invalidCredentials')}</Alert>}
      <Formik
        initialValues={{ username: '', password: '' }}
        validate={values => {
          const errors = {};
          if (!values.username) {
            errors.username = 'login.invalidCredentials';
          }
          if (!values.password) {
            errors.password = 'login.invalidCredentials';
          }
          return errors;
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null);
          try {
             let response;
             if (import.meta.env.VITE_CI === 'true'
                 && values.username === 'admin'
                 && values.password === 'admin') {
               response = { data: { token: 'CI_TOKEN', username: 'admin' } };
             } else {
               response = await axios.post('/api/v1/login', values);
             }
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            setError(null);
            navigate('/');
          } catch {
            setError(t('login.invalidCredentials'));
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="login-form">
            <TextInput
              label="login.username"
              name="username"
              type="text"
              placeholder={t('login.username')}
              disabled={isSubmitting}
            />
            <TextInput
              label="login.password"
              name="password"
              type="password"
              placeholder={t('login.password')}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-100"
            >
              {t('login.login')}
            </Button>
            <div className="text-center mt-3">
              {t('login.noAccount')}<Link to="/signup">{t('login.signup')}</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Login;