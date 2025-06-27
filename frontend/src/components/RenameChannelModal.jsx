import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Formik, Form } from 'formik'
import { Modal, Button, } from 'react-bootstrap'
import { renameChannel } from '../store'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import LeoProfanity from 'leo-profanity'
import profanityWords from '../utils/profanityDictionary'
import { TextInput } from './TextInput'
import { getChannelValidationSchema } from '../utils/validation'

LeoProfanity.add(profanityWords)

function RenameChannelModal({ show, onHide, channelId, currentName }) {
  const dispatch = useDispatch()
  const { loading, channels } = useSelector(state => state.chat)
  const { t } = useTranslation()
  const inputRef = useRef(null)

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [show])

  const validationSchema = getChannelValidationSchema(channels, channelId)

  const handleRenameChannel = async (values, { setSubmitting }) => {
    const cleanedName = LeoProfanity.clean(values.name)
    try {
      await dispatch(renameChannel({ id: channelId, name: cleanedName })).unwrap()
      toast.success(t('toast.channelRenamed'))
      onHide()
    }
    catch {
      toast.error(t('toast.renameChannelFailed'))
    }
    finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: currentName }}
          validationSchema={validationSchema}
          onSubmit={handleRenameChannel}
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
                  {t('modals.rename')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}

export default RenameChannelModal
