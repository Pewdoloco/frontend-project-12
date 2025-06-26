import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import i18n from '../utils/i18n'
import { handleThunkError, handleRejected } from '../utils/api'

export const fetchMessages = createAsyncThunk(
  'messages/fetchMessages',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('/api/v1/messages', {
        headers: { Authorization: `Bearer ${token}` },
      })
      return response.data
    }
    catch (err) {
      return rejectWithValue(handleThunkError(err, 'toast.fetchChannelsFailed', i18n))
    }
  },
)

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ body, channelId, username }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        '/api/v1/messages',
        { body, channelId, username },
        { headers: { Authorization: `Bearer ${token}` } },
      )
    }
    catch (err) {
      return rejectWithValue(handleThunkError(err, 'toast.fetchChannelsFailed', i18n))
    }
  },
)

const messagesSlice = createSlice({
  name: 'messages',
  initialState: {
    list: [],
    loading: false,
    error: null,
    errorDisplayed: false,
  },
  reducers: {
    addMessage: (state, action) => {
      state.list.push(action.payload)
    },
    resetErrorDisplayed: (state) => {
      state.errorDisplayed = false
    },
  },
  extraReducers: (b) => {
    b
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMessages.fulfilled, (state, { payload }) => {
        state.loading = false
        state.list = payload
        state.errorDisplayed = false
      })
      .addCase(fetchMessages.rejected, (state, { payload }) => {
        handleRejected(state, payload, i18n, 'data-fetch-error')
      })
      .addCase(sendMessage.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(sendMessage.fulfilled, (state) => {
        state.loading = false
        state.errorDisplayed = false
      })
      .addCase(sendMessage.rejected, (state, { payload }) => {
        handleRejected(state, payload, i18n)
      })
  },
})

export const { addMessage, resetErrorDisplayed } = messagesSlice.actions
export default messagesSlice.reducer
