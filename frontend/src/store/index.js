import { configureStore } from '@reduxjs/toolkit'
import chatReducer, {
  fetchChannels,
  initWebSocket,
  setCurrentChannelId,
  setNetworkStatus,
  addChannel,
  removeChannel,
  renameChannel,
  addChannelSync,
  removeChannelSync,
  renameChannelSync,
} from './chatSlice'
import messagesReducer, {
  fetchMessages,
  sendMessage,
  addMessage,
} from './messagesSlice'

export const store = configureStore({
  reducer: {
    chat: chatReducer,
    messages: messagesReducer,
  },
})

export {
  fetchChannels,
  fetchMessages,
  sendMessage,
  initWebSocket,
  setCurrentChannelId,
  setNetworkStatus,
  addMessage,
  addChannel,
  removeChannel,
  renameChannel,
  addChannelSync,
  removeChannelSync,
  renameChannelSync,
}
