import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { Modal, Button, Form as BootstrapForm } from 'react-bootstrap';
import { renameChannel } from '../store';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  const { t } = useTranslation();
  return (
    <BootstrapForm.Group>
      <BootstrapForm.Label>{t(label)}</BootstrapForm.Label>
      <BootstrapForm.Control {...field} {...props} isInvalid={meta.touched && meta.error} />
      {meta.touched && meta.error ? (
        <div className="text-danger mt-1">
          {meta.error === 'Required' ? t('modals.required') : meta.error}
        </div>
      ) : null}
    </BootstrapForm.Group>
  );
};

function RenameChannelModal({ show, onHide, channelId, currentName }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.chat);
  const { t } = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [show]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, t('modals.nameLength'))
      .max(20, t('modals.nameLength'))
      .required(t('modals.required')),
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.renameChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={{ name: currentName }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              await dispatch(renameChannel({ id: channelId, name: values.name })).unwrap();
              toast.success(t('toast.channelRenamed', { name: currentName }));
              onHide();
            } catch {
              // Ошибка обрабатывается в chatSlice.js через toast.error
            } finally {
              setSubmitting(false);
            }
          }}
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
                <Button variant="secondary" onClick={onHide} disabled={isSubmitting || loading}>
                  {t('modals.cancel')}
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting || loading}>
                  {t('modals.rename')}
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default RenameChannelModal;