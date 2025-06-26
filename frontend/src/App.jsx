import { useEffect, useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Provider, ErrorBoundary } from '@rollbar/react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Header from './components/Header.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import registerAdminCI from './utils/registerAdminCI'

const rollbarConfig = {
  accessToken: import.meta.env.VITE_ROLLBAR_ACCESS_TOKEN,
  environment: import.meta.env.VITE_ROLLBAR_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    client: {
      javascript: {
        source_map_enabled: true,
        code_version: import.meta.env.VITE_GIT_SHA || 'unknown',
      },
    },
  },
}

function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await registerAdminCI()
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return null

  return (
    <Provider config={rollbarConfig}>
      <ErrorBoundary>
        <Header />
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute><Home /></ProtectedRoute>}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer />
      </ErrorBoundary>
    </Provider>
  )
}

export default App
