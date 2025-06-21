import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5001', {
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  auth: cb => {
    const token = localStorage.getItem('token');
    cb({ token });
  },
  transports: ['websocket', 'polling'],
});

export default socket;