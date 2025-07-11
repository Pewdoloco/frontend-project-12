import { io } from 'socket.io-client'

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  auth: (cb) => {
    const token = localStorage.getItem('token')
    cb({ token })
  },
})

export default socket
