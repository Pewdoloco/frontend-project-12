import { configureStore } from '@reduxjs/toolkit';
import chatReducer, {
  fetchChannels,
  fetchMessages,
  sendMessage,
  initWebSocket,
  setCurrentChannelId,
  addMessage,
  setNetworkStatus,
  addChannel,
  removeChannel,
  renameChannel,
  addChannelSync,
  removeChannelSync,
  renameChannelSync,
} from './chatSlice';

export const store = configureStore({
  reducer: {
    chat: chatReducer,
  },
});

export {
  fetchChannels,
  fetchMessages,
  sendMessage,
  initWebSocket,
  setCurrentChannelId,
  addMessage,
  setNetworkStatus,
  addChannel,
  removeChannel,
  renameChannel,
  addChannelSync,
  removeChannelSync,
  renameChannelSync,
};