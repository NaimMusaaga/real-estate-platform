import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { connectSocket, disconnectSocket } from '../services/socket/socketClient';
import type { AppSocket, ConnectionReadyPayload, PresenceStatus, PresenceUpdatePayload } from '../types/socket.types';

export interface PresenceInfo {
  status: PresenceStatus;
  lastSeenAt?: string;
}

export interface SocketContextValue {
  socket: AppSocket | null;
  presenceMap: Record<string, PresenceInfo>;
}

export const SocketContext = createContext<SocketContextValue>({ socket: null, presenceMap: {} });

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [socket, setSocket] = useState<AppSocket | null>(null);
  const [presenceMap, setPresenceMap] = useState<Record<string, PresenceInfo>>({});

  useEffect(() => {
    if (!user) {
      disconnectSocket();
      setSocket(null);
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    const s = connectSocket(token);
    setSocket(s);

    function handleReady(payload: ConnectionReadyPayload) {
      // Snapshot of who's already online, closing the gap for anyone who connected
      // before this session did (see the matching backend comment in sockets/index.js).
      setPresenceMap((prev) => ({ ...prev, ...payload.presence }));
    }

    function handlePresence(payload: PresenceUpdatePayload) {
      setPresenceMap((prev) => ({ ...prev, [payload.userId]: { status: payload.status, lastSeenAt: payload.lastSeenAt } }));
    }

    s.on('connection.ready', handleReady);
    s.on('presence.update', handlePresence);

    return () => {
      s.off('connection.ready', handleReady);
      s.off('presence.update', handlePresence);
    };
  }, [user]);

  return <SocketContext.Provider value={{ socket, presenceMap }}>{children}</SocketContext.Provider>;
}
