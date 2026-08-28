import { io } from 'socket.io-client';
import type { AppSocket } from '../../types/socket.types';

let socket: AppSocket | null = null;

export function connectSocket(token: string): AppSocket {
  if (socket) return socket;
  socket = io(import.meta.env.VITE_SOCKET_URL, { auth: { token } });
  return socket;
}

export function getSocket(): AppSocket | null {
  return socket;
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
