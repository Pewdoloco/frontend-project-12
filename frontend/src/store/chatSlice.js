import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import socket from '../utils/socket'
import { toast } from 'react-toastify'
import i18n from '../utils/i18n'

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` },
      })
      console.log('Channels fetched:', response.data)
      return response.data
    }
    catch (err) {
      const errorMessage = err.response?.status === 401
        ? i18n.t('common.unauthorized')
        : err.response?.data?.message || i18n.t('toast.fetchChannelsFailed')
      console.error('Fetch channels error:', err)
      return rejectWithValue(errorMessage)
    }
  },
)

export const fetchMessages = createAsyncThunk(
  'chat/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/v1/messages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (err) {
      const errorMessage = err.response?.status === 401
        ? i18n.t('common.unauthorized')
        : err.response?.data?.message || i18n.t('toast.fetchMessagesFailed')
      return rejectWithValue(errorMessage)
    }
  },
)

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ body, channelId, username }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        '/api/v1/messages',
        { body, channelId, username },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return response.data
    }
    catch (err) {
      const errorMessage = err.response?.status === 401
        ? i18n.t('common.unauthorized')
        : err.response?.data?.message || i18n.t('toast.sendMessageFailed')
      return rejectWithValue(errorMessage)
    }
  },
)

export const addChannel = createAsyncThunk(
  'chat/addChannel',
  async (name, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(
        '/api/v1/channels',
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return response.data
    }
    catch (err) {
      const errorMessage = err.response?.status === 401
        ? i18n.t('common.unauthorized')
        : err.response?.data?.message || i18n.t('toast.addChannelFailed')
      return rejectWithValue(errorMessage)
    }
  },
)

export const removeChannel = createAsyncThunk(
  'chat/removeChannel',
  async (id, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/api/v1/channels/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      return id
    }
    catch (err) {
      const errorMessage = err.response?.status === 401
        ? i18n.t('common.unauthorized')
        : err.response?.data?.message || i18n.t('toast.removeChannelFailed')
      return rejectWithValue(errorMessage)
    }
  },
)

export const renameChannel = createAsyncThunk(
  'chat/renameChannel',
  async ({ id, name }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.patch(
        `/api/v1/channels/${id}`,
        { name },
        { headers: { Authorization: `Bearer ${token}` } },
      )
      return response.data
    }
    catch (err) {
      const errorMessage = err.response?.status === 401
        ? i18n.t('common.unauthorized')
        : err.response?.data?.message || i18n.t('toast.renameChannelFailed')
      return rejectWithValue(errorMessage)
    }
  },
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
    messages: [],
    currentChannelId: null,
    loading: false,
    error: null,
    networkStatus: 'disconnected',
    errorDisplayed: false,
  },
  reducers: {
    setCurrentChannelId: (state, action) => {
      state.currentChannelId = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload
    },
    addChannelSync: (state, action) => {
      state.channels.push(action.payload)
    },
    removeChannelSync: (state, action) => {
      state.channels = state.channels.filter(channel => channel.id !== action.payload)
      state.messages = state.messages.filter(
        message => message.channelId !== action.payload,
      )
      if (state.currentChannelId === action.payload) {
        const generalChannel = state.channels.find(c => c.name === 'general')
        state.currentChannelId = generalChannel?.id || state.channels[0]?.id || null
      }
    },
    renameChannelSync: (state, action) => {
      const channel = state.channels.find(c => c.id === action.payload.id)
      if (channel) {
        channel.name = action.payload.name
      }
    },
    resetErrorDisplayed: (state) => {
      state.errorDisplayed = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, action) => {
        state.loading = false
        state.channels = action.payload
        const generalChannel = action.payload.find(c => c.name === 'general')
        state.currentChannelId = generalChannel?.id || action.payload[0]?.id || null
        state.errorDisplayed = false
      })
      .addCase(fetchChannels.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        if (!state.errorDisplayed) {
          toast.error(i18n.t('toast.error', { error: action.payload }), { toastId: 'data-fetch-error' })
          state.errorDisplayed = true
        }
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false
        state.messages = action.payload
        state.errorDisplayed = false
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        if (!state.errorDisplayed) {
          toast.error(i18n.t('toast.error', { error: action.payload }), { toastId: 'data-fetch-error' })
          state.errorDisplayed = true
        }
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false
        state.errorDisplayed = false
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(i18n.t('toast.error', { error: action.payload }))
        state.networkStatus = 'error'
        state.errorDisplayed = false
      })
      .addCase(addChannel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addChannel.fulfilled, (state, action) => {
        state.loading = false
        state.currentChannelId = action.payload.id
        state.errorDisplayed = false
      })
      .addCase(addChannel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(i18n.t('toast.error', { error: action.payload }))
        state.errorDisplayed = false
      })
      .addCase(removeChannel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeChannel.fulfilled, (state) => {
        state.loading = false
        state.errorDisplayed = false
      })
      .addCase(removeChannel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(i18n.t('toast.error', { error: action.payload }))
        state.errorDisplayed = false
      })
      .addCase(renameChannel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(renameChannel.fulfilled, (state) => {
        state.loading = false
        state.errorDisplayed = false
      })
      .addCase(renameChannel.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        toast.error(i18n.t('toast.error', { error: action.payload }))
        state.errorDisplayed = false
      })
  },
})

export const {
  setCurrentChannelId,
  addMessage,
  setNetworkStatus,
  addChannelSync,
  removeChannelSync,
  renameChannelSync,
  resetErrorDisplayed,
} = chatSlice.actions
export default chatSlice.reducer

export const initWebSocket = () => (dispatch) => {
  socket.on('connect', () => {
    dispatch(setNetworkStatus('connected'))
  })

  socket.on('newMessage', (data) => {
    dispatch(addMessage(data))
  })

  socket.on('newChannel', (data) => {
    dispatch(addChannelSync(data))
  })

  socket.on('removeChannel', (data) => {
    dispatch(removeChannelSync(data.id))
  })

  socket.on('renameChannel', (data) => {
    dispatch(renameChannelSync(data))
  })

  socket.on('disconnect', () => {
    const isLoggingOut = localStorage.getItem('isLoggingOut') === 'true'
    if (!isLoggingOut) {
      dispatch(setNetworkStatus('disconnected'))
      toast.error(i18n.t('toast.networkError'), { toastId: 'network-error' })
    }
    localStorage.removeItem('isLoggingOut')
  })

  if (socket.connected) {
    dispatch(setNetworkStatus('connected'))
  }
  else {
    socket.connect()
  }

  return () => {
    socket.off('connect')
    socket.off('newMessage')
    socket.off('newChannel')
    socket.off('removeChannel')
    socket.off('renameChannel')
    socket.off('disconnect')
  }
}
