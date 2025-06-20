import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels, fetchMessages, setCurrentChannelId } from '../store/chatSlice';
import { Container, Row, Col, ListGroup, Form, Button } from 'react-bootstrap';
import './Home.css';

function Home() {
  const dispatch = useDispatch();
  const { channels, messages, currentChannelId, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchChannels());
    dispatch(fetchMessages());
  }, [dispatch]);

  const handleChannelClick = (channelId) => {
    dispatch(setCurrentChannelId(channelId));
  };

  const filteredMessages = messages.filter(
    (message) => message.channelId === currentChannelId
  );

  return (
    <Container fluid className="chat-container">
      {error && <div className="alert alert-danger">{error}</div>}
      {loading && <div>Loading...</div>}
      <Row>
        <Col md={3} className="channel-list">
          <h3>Channels</h3>
          <ListGroup>
            {channels.map((channel) => (
              <ListGroup.Item
                key={channel.id}
                active={channel.id === currentChannelId}
                onClick={() => handleChannelClick(channel.id)}
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
          <Form className="message-form">
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Type a message..."
                disabled={!currentChannelId}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              disabled={!currentChannelId}
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