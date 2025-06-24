import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChannels,
  fetchMessages,
  sendMessage,
  initWebSocket,
  setCurrentChannelId,
} from '../store';
import {
  Container,
  Col,
  ListGroup,
  Form,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import AddChannelModal from '../components/AddChannelModal';
import RemoveChannelModal from '../components/RemoveChannelModal';
import RenameChannelModal from '../components/RenameChannelModal';
import './Home.css';
import { useTranslation } from 'react-i18next';
import LeoProfanity from 'leo-profanity';
import profanityWords from '../utils/profanityDictionary';

LeoProfanity.add(profanityWords);

function Home() {
  const dispatch = useDispatch();
  const { channels, messages, currentChannelId, loading, networkStatus } = useSelector(
    state => state.chat
  );
  const { t } = useTranslation();
  const [messageInput, setMessageInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setTimeout(() => {
        dispatch(fetchChannels());
        dispatch(fetchMessages());
        const cleanup = dispatch(initWebSocket());
        return () => cleanup();
      }, 100);
    }
  }, [dispatch]);

  const handleChannelSelect = channelId => {
    dispatch(setCurrentChannelId(channelId));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!messageInput.trim() || !currentChannelId) return;

    const cleanedMessage = LeoProfanity.clean(messageInput);

    const username = localStorage.getItem('username') || 'unknown';
    dispatch(
      sendMessage({
        body: cleanedMessage,
        channelId: currentChannelId,
        username,
      })
    );
    setMessageInput('');
  };

  const filteredMessages = messages.filter(
    message => message.channelId === currentChannelId
  );

  return (
    <Container fluid className="chat-container">
      {loading && <div>{t('common.loading')}</div>}
      <div className="chat-content">
        <Col className="channel-list">
          <div className="channel-header">
            <h3>{t('home.channels')}</h3>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              {t('home.addChannel')}
            </Button>
          </div>
          <ListGroup className="mt-2">
            {channels.map(channel => (
              <ListGroup.Item
                key={channel.id}
                as="div"
                active={channel.id === currentChannelId}
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: 'pointer' }}
              >
                <button
                  type="button"
                  role="button"
                  className="btn btn-link text-start w-100 rounded-0"
                  onClick={() => handleChannelSelect(channel.id)}
                >
                  <span className="me-1">#</span>{channel.name}
                </button>
                {channel.removable && (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle split variant="light" size="sm" />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => setShowRenameModal(channel.id)}
                        disabled={loading}
                      >
                        {t('modals.rename')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setShowRemoveModal(channel.id)}
                        disabled={loading}
                      >
                        {t('modals.remove')}
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col className="chat-area">
          <h3>{t('home.chat')}</h3>
          <div className="messages">
            {filteredMessages.map(message => (
              <div key={message.id} className="message">
                <strong>{message.username}: </strong>
                <span style={{ wordBreak: 'break-word' }}>{message.body}</span>
              </div>
            ))}
          </div>
          <Form className="message-form" onSubmit={handleSubmit}>
            <Form.Group className="flex-grow-1">
              <Form.Control
                type="text"
                placeholder={t('home.typeMessage')}
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                disabled={!currentChannelId || networkStatus !== 'connected'}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!currentChannelId || networkStatus !== 'connected' || loading}
            >
              {t('home.send')}
            </Button>
          </Form>
        </Col>
      </div>
      <AddChannelModal show={showAddModal} onHide={() => setShowAddModal(false)} />
      {showRemoveModal && (
        <RemoveChannelModal
          show={!!showRemoveModal}
          onHide={() => setShowRemoveModal(null)}
          channelId={showRemoveModal}
        />
      )}
      {showRenameModal && (
        <RenameChannelModal
          show={!!showRenameModal}
          onHide={() => setShowRenameModal(null)}
          channelId={showRenameModal}
          currentName={channels.find(c => c.id === showRenameModal)?.name || ''}
        />
      )}
    </Container>
  );
}

export default Home;