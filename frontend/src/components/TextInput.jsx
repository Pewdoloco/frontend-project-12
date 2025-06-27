import { useField } from 'formik'
import { Form as BootstrapForm } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

export const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props)
  const { t } = useTranslation()
  return (
    <BootstrapForm.Group>
      <BootstrapForm.Label>{t(label)}</BootstrapForm.Label>
      <BootstrapForm.Control
        {...field}
        {...props}
        isInvalid={meta.touched && meta.error}
        aria-label={t('modals.channelName')}
      />
      {meta.touched && meta.error && (
        <div className="text-danger mt-1">
          {meta.error === 'Required' ? t('modals.required') : t(meta.error)}
        </div>
      )}
    </BootstrapForm.Group>
  )
}
