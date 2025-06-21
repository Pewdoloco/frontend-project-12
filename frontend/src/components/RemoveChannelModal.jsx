import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Alert } from 'react-bootstrap';
import { removeChannel } from '../store';

function RemoveChannelModal({ show, onHide, channelId }) {
  const dispatch = useDispatch();
  const { error, loading } = useSelector(state => state.chat);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Remove Channel</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <p>Are you sure you want to remove this channel?</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={async () => {
            try {
              await dispatch(removeChannel(channelId)).unwrap();
              onHide();
            } catch {
              // Ошибка отобразится через Alert
            }
          }}
          disabled={loading}
        >
          Remove
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RemoveChannelModal;