import { useState } from 'react'
import { Formik, Form, useField } from 'formik'
import * as Yup from 'yup'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Alert, Button, Form as BootstrapForm } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const { t } = useTranslation()
  return (
    <BootstrapForm.Group className="mb-3">
      <BootstrapForm.Label htmlFor={props.name}>{t(label)}</BootstrapForm.Label>
      <BootstrapForm.Control
        id={props.name}
        aria-label={t(label)}
        {...field}
        {...props}
        isInvalid={meta.touched && meta.error}
      />
      {
        meta.touched && meta.error
          ? (
              <div className="text-danger mt-1">
                {t(meta.error)}
              </div>
            )
          : null
      }
    </BootstrapForm.Group>
  )
}

function Signup() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [error, setError] = useState(null)

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
  })

  return (
    <div className="container-sm mx-auto p-3" style={{ maxWidth: '400px' }}>
      <h1 className="display-4">{t('signup.title')}</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Formik
        initialValues={{ username: '', password: '', confirmPassword: '' }}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null)
          try {
            const response = await axios.post('/api/v1/signup', {
              username: values.username,
              password: values.password,
            })
            if (response.status === 201) {
              localStorage.setItem('token', response.data.token)
              localStorage.setItem('username', response.data.username)
              setError(null)
              navigate('/')
            }
          }
          catch (err) {
            if (err.response?.status === 409) {
              setError(t('signup.userExists'))
            }
            else {
              setError(t('signup.registrationFailed'))
            }
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="d-flex flex-column gap-4">
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
              className="w-100 fw-medium rounded"
            >
              {t('signup.signup')}
            </Button>
            <div className="text-center mt-3">
              {t('signup.haveAccount')}
              <Link to="/login" className="text-decoration-none fw-medium">
                {t('signup.login')}
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Signup
