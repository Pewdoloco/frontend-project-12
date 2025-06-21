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
  Row,
  Col,
  ListGroup,
  Form,
  Button,
  Alert,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap';
import AddChannelModal from '../components/AddChannelModal';
import RemoveChannelModal from '../components/RemoveChannelModal';
import RenameChannelModal from '../components/RenameChannelModal';
import './Home.css';

function Home() {
  const dispatch = useDispatch();
  const { channels, messages, currentChannelId, loading, error, networkStatus } = useSelector(
    state => state.chat
  );
  const [messageInput, setMessageInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(null);
  const [showRenameModal, setShowRenameModal] = useState(null);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
    const cleanup = dispatch(initWebSocket());
    return () => cleanup();
  }, [dispatch]);

  const handleChannelSelect = channelId => {
    dispatch(setCurrentChannelId(channelId));
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (messageInput.trim()) {
      const username = localStorage.getItem('username') || 'unknown';
      dispatch(
        sendMessage({
          body: messageInput,
          channelId: currentChannelId,
          username,
        })
      );
      setMessageInput('');
    }
  };

  const filteredMessages = messages.filter(
    message => message.channelId === currentChannelId
  );

  return (
    <Container fluid className="chat-container">
      {error && <Alert variant="danger">{error}</Alert>}
      {networkStatus === 'disconnected' && (
        <Alert variant="warning">Disconnected from server. Reconnecting...</Alert>
      )}
      {loading && <div>Loading...</div>}
      <Row>
        <Col md={3} className="channel-list">
          <h3>
            Channels{' '}
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              +
            </Button>
          </h3>
          <ListGroup>
            {channels.map(channel => (
              <ListGroup.Item
                key={channel.id}
                as="div"
                active={channel.id === currentChannelId}
                className="d-flex justify-content-between align-items-center"
              >
                <span
                  onClick={() => handleChannelSelect(channel.id)}
                  style={{ cursor: 'pointer', flex: 1 }}
                >
                  # {channel.name}
                </span>
                {channel.removable && (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle split variant="light" size="sm" />
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => setShowRenameModal(channel.id)}
                        disabled={loading}
                      >
                        Rename
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setShowRemoveModal(channel.id)}
                        disabled={loading}
                      >
                        Remove
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9} className="chat-area">
          <h3>Chat</h3>
          <div className="messages">
            {filteredMessages.map(message => (
              <div key={message.id} className="message">
                <strong>{message.username}: </strong>
                <span style={{ wordBreak: 'break-word' }}>{message.body}</span>
              </div>
            ))}
          </div>
          <Form className="message-form" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                disabled={!currentChannelId || networkStatus !== 'connected'}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!currentChannelId || networkStatus !== 'connected' || loading}
              className="mt-2"
            >
              Send
            </Button>
          </Form>
        </Col>
      </Row>
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