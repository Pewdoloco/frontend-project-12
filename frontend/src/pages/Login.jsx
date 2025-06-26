import { useState } from 'react'
import { Formik, Form, useField } from 'formik'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import { Alert, Button, Form as BootstrapForm } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const TextInput = ({ id, ...props }) => {
  const [field, meta] = useField(props)
  return (
    <BootstrapForm.Group className="form-floating mb-3">
      <BootstrapForm.Control
        {...field}
        {...props}
        id={id}
        placeholder=""
        isInvalid={meta.touched && meta.error}
      />
      <BootstrapForm.Label htmlFor={id}>{props.placeholder}</BootstrapForm.Label>
      {meta.touched && meta.error && (
        <div className="text-danger mt-1">{meta.error}</div>
      )}
    </BootstrapForm.Group>
  )
}

function Login() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [error, setError] = useState(null)

  return (
    <div className="container-sm mx-auto p-3" style={{ maxWidth: '400px' }}>
      <h1 className="display-4">{t('login.title')}</h1>
      {error === 'login' && (<Alert variant="danger">{t('login.invalidCredentials')}</Alert>)}
      <Formik
        initialValues={{ username: '', password: '' }}
        validate={(values) => {
          const errors = {}
          if (!values.username) {
            errors.username = t('login.invalidCredentials')
          }
          if (!values.password) {
            errors.password = t('login.invalidCredentials')
          }
          return errors
        }}
        onSubmit={async (values, { setSubmitting }) => {
          setError(null)
          try {
            const response = await axios.post('/api/v1/login', values)
            localStorage.setItem('token', response.data.token)
            localStorage.setItem('username', response.data.username)
            setError(null)
            navigate('/')
          }
          catch {
            setError('login')
            setSubmitting(false)
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="d-flex flex-column gap-4">
            <TextInput
              name="username"
              type="text"
              id="username"
              placeholder={t('login.username')}
              disabled={isSubmitting}
            />
            <TextInput
              name="password"
              type="password"
              id="password"
              placeholder={t('login.password')}
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="w-100 fw-medium rounded"
            >
              {t('login.login')}
            </Button>
            <div className="text-center mt-3">
              {t('login.noAccount')}
              <Link to="/signup" className="text-decoration-none fw-medium">
                {t('login.signup')}
              </Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default Login
