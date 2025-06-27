import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import { Modal, Button } from 'react-bootstrap'
import { addChannel } from '../store'
import { useTranslation } from 'react-i18next'
import LeoProfanity from 'leo-profanity'
import { toast } from 'react-toastify'
import profanityWords from '../utils/profanityDictionary'
import { TextInput } from './TextInput'
import { getChannelValidationSchema } from '../utils/validation'

LeoProfanity.add(profanityWords)

function AddChannelModal({ show, onHide }) {
  const dispatch = useDispatch()
  const { loading, channels } = useSelector(state => state.chat)
  const { t } = useTranslation()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus()
    }
  }, [show])

  const validationSchema = getChannelValidationSchema(channels)

  const handleAddChannel = async (values, { setSubmitting, resetForm }) => {
    const cleanedName = LeoProfanity.clean(values.name)
    try {
      await dispatch(addChannel(cleanedName)).unwrap()
      toast.success(t('toast.channelAdded'))
      resetForm()
      onHide()
    }
    catch {
      toast.error(t('toast.addChannelFailed'))
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.addChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={handleAddChannel}
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
                  {t('modals.add')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default AddChannelModal
