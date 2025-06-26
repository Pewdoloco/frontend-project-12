export const handleThunkError = (err, fallbackKey, i18n) => {
  if (err.response?.status === 401) {
    window.location.href = '/login'
    return i18n.t('common.unauthorized')
  }
  return err.response?.data?.message || i18n.t(fallbackKey)
}

export const handleRejected = (state, payload, i18n, toastId = null) => {
  state.loading = false
  state.error = payload
  if (!state.errorDisplayed) {
    const options = toastId ? { toastId } : undefined
    const message = i18n.t('toast.error', { error: payload })
    import('react-toastify').then(({ toast }) => toast.error(message, options))
    state.errorDisplayed = true
  }
}
