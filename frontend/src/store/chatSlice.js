import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import socket from '../utils/socket'
import i18n from '../utils/i18n'
import { addMessage } from './messagesSlice'
import { handleThunkError, handleRejected } from '../utils/api'

export const fetchChannels = createAsyncThunk(
  'chat/fetchChannels',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/v1/channels', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (err) {
      return rejectWithValue(handleThunkError(err, 'toast.fetchChannelsFailed', i18n))
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
      return rejectWithValue(handleThunkError(err, 'toast.fetchChannelsFailed', i18n))
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
      return rejectWithValue(handleThunkError(err, 'toast.fetchChannelsFailed', i18n))
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
      return rejectWithValue(handleThunkError(err, 'toast.fetchChannelsFailed', i18n))
    }
  },
)

const chatSlice = createSlice({
  name: 'chat',
  initialState: {
    channels: [],
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
    setNetworkStatus: (state, action) => {
      state.networkStatus = action.payload
    },
    addChannelSync: (state, action) => {
      state.channels.push(action.payload)
    },
    removeChannelSync: (state, action) => {
      state.channels = state.channels.filter(c => c.id !== action.payload)
      if (state.currentChannelId === action.payload) {
        const general = state.channels.find(c => c.name === 'general')
        state.currentChannelId = general?.id || state.channels[0]?.id || null
      }
    },
    renameChannelSync: (state, action) => {
      const ch = state.channels.find(c => c.id === action.payload.id)
      if (ch) {
        ch.name = action.payload.name
      }
    },
    resetErrorDisplayed: (state) => {
      state.errorDisplayed = false
    },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchChannels.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchChannels.fulfilled, (state, { payload }) => {
        state.loading = false
        state.channels = payload
        const general = payload.find(c => c.name === 'general')
        state.currentChannelId = general?.id || payload[0]?.id || null
        state.errorDisplayed = false
      })
      .addCase(fetchChannels.rejected, (state, { payload }) => {
        handleRejected(state, payload, i18n, 'data-fetch-error')
      })
      .addCase(addChannel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(addChannel.fulfilled, (state, { payload }) => {
        state.loading = false
        state.currentChannelId = payload.id
        state.errorDisplayed = false
      })
      .addCase(addChannel.rejected, (state, { payload }) => {
        handleRejected(state, payload, i18n)
      })
      .addCase(removeChannel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(removeChannel.fulfilled, (state) => {
        state.loading = false
        state.errorDisplayed = false
      })
      .addCase(removeChannel.rejected, (state, { payload }) => {
        handleRejected(state, payload, i18n)
      })
      .addCase(renameChannel.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(renameChannel.fulfilled, (state) => {
        state.loading = false
        state.errorDisplayed = false
      })
      .addCase(renameChannel.rejected, (state, { payload }) => {
        handleRejected(state, payload, i18n)
      })
  },
})

export const {
  setCurrentChannelId,
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
  socket.on('removeChannel', ({ id }) => {
    dispatch(removeChannelSync(id))
  })
  socket.on('renameChannel', (data) => {
    dispatch(renameChannelSync(data))
  })

  socket.on('disconnect', () => {
    const isLoggingOut = localStorage.getItem('isLoggingOut') === 'true'
    if (!isLoggingOut) {
      dispatch(setNetworkStatus('disconnected'))
      import('react-toastify').then(({ toast }) => {
        toast.error(i18n.t('toast.networkError'), { toastId: 'network-error' })
      })
    }
    localStorage.removeItem('isLoggingOut')
  })

  if (!socket.connected) {
    socket.connect()
  } else {
    dispatch(setNetworkStatus('connected'))
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
