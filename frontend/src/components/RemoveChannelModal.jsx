import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button, Alert } from 'react-bootstrap';
import { removeChannel } from '../store';
import { useTranslation } from 'react-i18next';

function RemoveChannelModal({ show, onHide, channelId }) {
  const dispatch = useDispatch();
  const { error, loading } = useSelector(state => state.chat);
  const { t } = useTranslation();

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{t('common.error')}: {error}</Alert>}
        <p>{t('modals.confirmRemove')}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          {t('modals.cancel')}
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
          {t('modals.remove')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RemoveChannelModal;