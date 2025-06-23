import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'react-bootstrap';
import { removeChannel } from '../store';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

function RemoveChannelModal({ show, onHide, channelId }) {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.chat);
  const { t } = useTranslation();
  const state = useSelector(state => state.chat);

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{t('modals.removeChannel')}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
              const channelName = state.channels.find(c => c.id === channelId)?.name;
              await dispatch(removeChannel(channelId)).unwrap();
              toast.success(t('toast.channelRemoved', { name: channelName }));
              onHide();
            } catch {
              // Ошибка обрабатывается в chatSlice.js через toast.error
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