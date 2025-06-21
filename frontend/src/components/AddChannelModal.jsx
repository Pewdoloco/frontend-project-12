import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, useField } from 'formik';
import * as Yup from 'yup';
import { Modal, Button, Form as BootstrapForm, Alert } from 'react-bootstrap';
import { addChannel } from '../store';

const TextInput = ({ label, ...props }) => {
  const [field, meta] = useField(props);
  return (
    <BootstrapForm.Group>
      <BootstrapForm.Label>{label}</BootstrapForm.Label>
      <BootstrapForm.Control {...field} {...props} isInvalid={meta.touched && meta.error} />
      {meta.touched && meta.error ? (
        <div className="text-danger mt-1">{meta.error}</div>
      ) : null}
    </BootstrapForm.Group>
  );
};

function AddChannelModal({ show, onHide }) {
  const dispatch = useDispatch();
  const { channels, error, loading } = useSelector(state => state.chat);
  const inputRef = useRef(null);

  useEffect(() => {
    if (show && inputRef.current) {
      inputRef.current.focus();
    }
  }, [show]);

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Must be 3–20 characters')
      .max(20, 'Must be 3–20 characters')
      .notOneOf(channels.map(c => c.name), 'Channel name must be unique')
      .required('Required'),
  });

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Formik
          initialValues={{ name: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            try {
              await dispatch(addChannel(values.name)).unwrap();
              resetForm();
              onHide();
            } catch {
              setSubmitting(false);
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <TextInput
                label="Channel Name"
                name="name"
                type="text"
                ref={inputRef}
                disabled={isSubmitting || loading}
              />
              <Modal.Footer>
                <Button variant="secondary" onClick={onHide} disabled={isSubmitting || loading}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting || loading}>
                  Add
                </Button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  );
}

export default AddChannelModal;