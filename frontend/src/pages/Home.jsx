import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages, sendMessage, initWebSocket, setCurrentChannelId } from '../store';
import { Container, Row, Col, ListGroup, Form, Button, Alert } from 'react-bootstrap';
import './Home.css';

function Home() {
  const dispatch = useDispatch();
  const { channels, messages, currentChannelId, loading, error, networkStatus } = useSelector(
    (state) => state.chat
  );
  const [messageInput, setMessageInput] = useState('');

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
    const cleanup = dispatch(initWebSocket());
    return () => cleanup();
  }, [dispatch]);

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannelId(channelId));
  };

  const handleSubmit = (e) => {
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
    (message) => message.channelId === currentChannelId
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
          <h3>Channels</h3>
          <ListGroup>
            {channels.map((channel) => (
              <ListGroup.Item
                key={channel.id}
                active={channel.id === currentChannelId}
                onClick={() => handleChannelSelect(channel.id)}
                action
              >
                {channel.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col md={9} className="chat-area">
          <h3>Chat</h3>
          <div className="messages">
            {filteredMessages.map((message) => (
              <div key={message.id} className="message">
                <strong>{message.username}: </strong>
                {message.body}
              </div>
            ))}
          </div>
          <Form className="message-form" onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Type a message..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                disabled={!currentChannelId || networkStatus !== 'connected'}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!currentChannelId || networkStatus !== 'connected'}
              className="mt-2"
            >
              Send
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;