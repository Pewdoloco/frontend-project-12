import React, { useState } from 'react';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Alert, Button, Form as BootstrapForm } from 'react-bootstrap';
import './Signup.css';

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <BootstrapForm.Group className="mb-3">
      <BootstrapForm.Label>{label}</BootstrapForm.Label>
      <BootstrapForm.Control {...field} {...props} isInvalid={meta.touched && meta.error} />
      {meta.touched && meta.error ? (
        <div className="text-danger mt-1">{meta.error}</div>
      ) : null}
    </BootstrapForm.Group>
  );
};

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Must be 3–20 characters')
      .max(20, 'Must be 3–20 characters')
      .required('Required'),
    password: Yup.string()
      .min(6, 'Must be at least 6 characters')
      .required('Required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required'),
  });

  return (
    <div className="signup-container">
      <h1>Sign Up</h1>
      {error && <Alert variant="danger">{error}</Alert>}
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
            navigate('/');
          } catch (err) {
            if (err.response?.status === 409) {
              setError('User already exists');
            } else {
              setError('Registration failed. Please try again.');
            }
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="signup-form">
            <TextInput
              label="Username"
              name="username"
              type="text"
              placeholder="Enter username"
              disabled={isSubmitting}
            />
            <TextInput
              label="Password"
              name="password"
              type="password"
              placeholder="Enter password"
              disabled={isSubmitting}
            />
            <TextInput
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-100"
            >
              Sign Up
            </Button>
            <div className="text-center mt-3">
              Already have an account? <Link to="/login">Log In</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default Signup;