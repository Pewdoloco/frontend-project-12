import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import socket from '../utils/socket';
import { toast } from 'react-toastify';
import i18n from '../utils/i18n';

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch channels');
    }
  }
);

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/v1/messages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ body, channelId, username }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/v1/messages',
        { body, channelId, username },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to send message');
    }
  }
);

export const addChannel = createAsyncThunk(
  'chat/addChannel',
  async (name, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        '/api/v1/channels',
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add channel');
    }
  }
);

export const removeChannel = createAsyncThunk(
  'chat/removeChannel',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/v1/channels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove channel');
    }
  }
);

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(
        `/api/v1/channels/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to rename channel');
    }
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    currentChannelId: null,
    loading: false,
    error: null,
    networkStatus: 'disconnected',
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload;
    },
    addChannelSync: (state, action) => {
      state.channels.push(action.payload);
      state.currentChannelId = action.payload.id;
    },
    removeChannelSync: (state, action) => {
      state.channels = state.channels.filter(channel => channel.id !== action.payload);
      state.messages = state.messages.filter(
        message => message.channelId !== action.payload
      );
      if (state.currentChannelId === action.payload) {
        const generalChannel = state.channels.find(c => c.name === 'general');
        state.currentChannelId = generalChannel?.id || state.channels[0]?.id || null;
      }
    },
    renameChannelSync: (state, action) => {
      const channel = state.channels.find(c => c.id === action.payload.id);
      if (channel) {
        channel.name = action.payload.name;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false;
        state.channels = action.payload;
        const generalChannel = action.payload.find(c => c.name === 'general');
        state.currentChannelId = generalChannel?.id || action.payload[0]?.id || null;
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(i18n.t('toast.error', { error: action.payload }));
      })
      .addCase(fetchMessages.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(i18n.t('toast.error', { error: action.payload }));
      })
      .addCase(sendMessage.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, state => {
        state.loading = false;
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(i18n.t('toast.error', { error: action.payload }));
        state.networkStatus = 'error';
      })
      .addCase(addChannel.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addChannel.fulfilled, state => {
        state.loading = false;
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(i18n.t('toast.error', { error: action.payload }));
      })
      .addCase(removeChannel.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeChannel.fulfilled, state => {
        state.loading = false;
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(i18n.t('toast.error', { error: action.payload }));
      })
      .addCase(renameChannel.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(renameChannel.fulfilled, state => {
        state.loading = false;
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        toast.error(i18n.t('toast.error', { error: action.payload }));
      });
  },
});

export const {
  setCurrentChannelId,
  addMessage,
  setNetworkStatus,
  addChannelSync,
  removeChannelSync,
  renameChannelSync,
} = chatSlice.actions;
export default chatSlice.reducer;

export const initWebSocket = () => dispatch => {
  socket.on('connect', () => {
    dispatch(setNetworkStatus('connected'));
    toast.dismiss();
  });

  socket.on('newMessage', data => {
    dispatch(addMessage(data));
  });

  socket.on('newChannel', data => {
    dispatch(addChannelSync(data));
  });

  socket.on('removeChannel', data => {
    dispatch(removeChannelSync(data.id));
  });

  socket.on('renameChannel', data => {
    dispatch(renameChannelSync(data));
  });

  socket.on('connect_error', () => {
    dispatch(setNetworkStatus('error'));
    toast.error(i18n.t('toast.networkError'));
  });

  socket.on('disconnect', () => {
    dispatch(setNetworkStatus('disconnected'));
    toast.error(i18n.t('toast.networkError'));
  });

  if (socket.connected) {
    dispatch(setNetworkStatus('connected'));
  } else {
    socket.connect();
  }

  return () => {
    socket.off('connect');
    socket.off('newMessage');
    socket.off('newChannel');
    socket.off('removeChannel');
    socket.off('renameChannel');
    socket.off('connect_error');
    socket.off('disconnect');
  };
};