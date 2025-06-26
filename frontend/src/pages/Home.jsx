import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchChannels,
  fetchMessages,
  sendMessage,
  initWebSocket,
  setCurrentChannelId,
} from '../store'
import {
  Container,
  Col,
  ListGroup,
  Form,
  Button,
  Dropdown,
  ButtonGroup,
} from 'react-bootstrap'
import AddChannelModal from '../components/AddChannelModal'
import RemoveChannelModal from '../components/RemoveChannelModal'
import RenameChannelModal from '../components/RenameChannelModal'
import { useTranslation } from 'react-i18next'
import LeoProfanity from 'leo-profanity'
import profanityWords from '../utils/profanityDictionary'

LeoProfanity.add(profanityWords)

function Home() {
  const dispatch = useDispatch()
  const { channels, currentChannelId, loading, networkStatus } = useSelector(
    (state) => state.chat,
  )
  const messages = useSelector((state) => state.messages.list)
  const { t } = useTranslation()
  const [messageInput, setMessageInput] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRemoveModal, setShowRemoveModal] = useState(null)
  const [showRenameModal, setShowRenameModal] = useState(null)
  const messageInputRef = useRef(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      dispatch(fetchChannels())
      dispatch(fetchMessages())
      const cleanup = dispatch(initWebSocket())
      return () => cleanup()
    }
  }, [dispatch])

  const handleChannelSelect = (channelId) => {
    dispatch(setCurrentChannelId(channelId))
  }

  useEffect(() => {
    if (messageInputRef.current && !loading && currentChannelId && networkStatus === 'connected') {
      messageInputRef.current.focus()
    }
  }, [loading, currentChannelId, networkStatus])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !currentChannelId) return

    const cleanedMessage = LeoProfanity.clean(messageInput)

    const username = localStorage.getItem('username') || 'unknown'
    dispatch(
      sendMessage({
        body: cleanedMessage,
        channelId: currentChannelId,
        username,
      }),
    )
    setMessageInput('')
  }

  const filteredMessages = messages.filter(
    (message) => message.channelId === currentChannelId,
  )

  return (
      <Container fluid className="d-flex flex-column min-vh-100 pb-5 overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
      {loading && <div>{t('common.loading')}</div>}
      <div className="flex-grow-1 d-flex h-100">
        <Col className="h-100 overflow-auto pe-2 flex-shrink-0" style={{ minWidth: '200px' }}>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h3>{t('home.channels')}</h3>
            <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
              {t('home.addChannel')}
            </Button>
          </div>
          <ListGroup className="mt-2 bg-white">
            {channels.map(channel => (
              <ListGroup.Item
                key={channel.id}
                as="div"
                active={channel.id === currentChannelId}
                className="d-flex justify-content-between align-items-center list-group-item-action"
                style={{ cursor: 'pointer' }}
              >
                <button
                  type="button"
                  role="button"
                  className="btn btn-link w-100 text-start text-decoration-none text-body"
                  onClick={() => handleChannelSelect(channel.id)}
                >
                  #
                  {channel.name}
                </button>
                {channel.removable && (
                  <Dropdown as={ButtonGroup}>
                    <Dropdown.Toggle
                      split
                      variant="light"
                      size="sm"
                      aria-label={t('home.channelManagement')}
                    >
                      {t('home.channelManagement')}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => setShowRenameModal(channel.id)}
                        disabled={loading}
                        className="text-body"
                      >
                        {t('modals.rename')}
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => setShowRemoveModal(channel.id)}
                        disabled={loading}
                        className="text-body"
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
        <Col className="d-flex flex-column h-100 overflow-hidden flex-grow-1" style={{ minWidth: '400px' }}>
          <h3>{t('home.chat')}</h3>
          <div className="flex-grow-1 overflow-auto p-2 border border-secondary rounded mb-2" style={{ wordBreak: 'break-word' }}>
            {filteredMessages.map(message => (
              <div key={message.id} className="mb-2">
                <strong>
                  {message.username}
                  :
                </strong>
                <span className="text-start" style={{ wordBreak: 'break-word' }}>{message.body}</span>
              </div>
            ))}
          </div>
          <Form className="d-flex gap-2" onSubmit={handleSubmit}>
            <Form.Group className="flex-grow-1">
              <Form.Control
                type="text"
                placeholder={t('home.typeMessage')}
                value={messageInput}
                onChange={e => setMessageInput(e.target.value)}
                disabled={!currentChannelId || networkStatus !== 'connected'}
                aria-label="Новое сообщение"
                ref={messageInputRef}
                className="bg-white"
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
  )
}

export default Home
