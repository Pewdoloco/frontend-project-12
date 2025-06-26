import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'
import i18n from '../utils/i18n'

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
      if (err.response?.status === 401) {
        window.location.href = '/login'
      }
      const errorMessage = err.response?.status === 401
        ? i18n.t('common.unauthorized')
        : err.response?.data?.message || i18n.t('toast.fetchMessagesFailed');
      return rejectWithValue(errorMessage)
    }
  },
);

export const sendMessage = createAsyncThunk(
  'messages/sendMessage',
  async ({ body, channelId, username }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token')
      await axios.post(
        '/api/v1/messages',
        { body, channelId, username },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    }
    catch (err) {
      if (err.response?.status === 401) {
        window.location.href = '/login'
      }
      const errorMessage = err.response?.status === 401
        ? i18n.t('common.unauthorized')
        : err.response?.data?.message || i18n.t('toast.sendMessageFailed')
      return rejectWithValue(errorMessage)
    }
  },
);

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
        state.loading = false
        state.error = payload
        if (!state.errorDisplayed) {
          toast.error(i18n.t('toast.error', { error: payload }), { toastId: 'data-fetch-error' })
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
      .addCase(sendMessage.rejected, (state, { payload }) => {
        state.loading = false
        state.error = payload
        if (!state.errorDisplayed) {
          toast.error(i18n.t('toast.error', { error: payload }))
          state.errorDisplayed = true
        }
      })
  },
})

export const { addMessage, resetErrorDisplayed } = messagesSlice.actions
export default messagesSlice.reducer

