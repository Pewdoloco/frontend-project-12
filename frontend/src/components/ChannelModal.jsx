import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import { Modal, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import LeoProfanity from 'leo-profanity'
import profanityWords from '../utils/profanityDictionary'
import { TextInput } from './TextInput'
import { getChannelValidationSchema } from '../utils/validation'

LeoProfanity.add(profanityWords)

function ChannelModal({ show, onHide, mode, channelId, currentName, action, successMessage, errorMessage }) {
  const dispatch = useDispatch()
  const { loading, channels } = useSelector((state) => state.chat)
  const { t } = useTranslation()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus()
      if (mode === 'rename') inputRef.current.select()
    }
  }, [show, mode])

  const validationSchema = getChannelValidationSchema(channels, mode === 'rename' ? channelId : null)

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    const cleanedName = LeoProfanity.clean(values.name)
    try {
      const payload = mode === 'rename' ? { id: channelId, name: cleanedName } : cleanedName
      await dispatch(action(payload)).unwrap()
      toast.success(t(successMessage))
      if (mode === 'add') resetForm()
      onHide()
    }
    catch {
      toast.error(t(errorMessage))
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t(`modals.${mode}Channel`)}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: mode === 'rename' ? currentName : '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                label="modals.channelName"
                name="name"
                type="text"
                ref={inputRef}
                disabled={isSubmitting || loading}
              />
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={onHide}
                  disabled={isSubmitting || loading}
                >
                  {t('modals.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={isSubmitting || loading}
                >
                  {t(`modals.${mode}`)}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default ChannelModal
