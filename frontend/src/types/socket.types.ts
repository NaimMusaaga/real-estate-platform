import type { Socket } from 'socket.io-client';

export interface ConnectionReadyPayload {
  userId: string;
  subscribedConversations: string[];
  presence: Record<string, { status: 'online' }>;
}

export interface MessageNewPayload {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
}

export interface MessageDeliveredPayload {
  conversationId: string;
  messageId: string;
  deliveredAt: string;
}

export interface MessageReadPayload {
  conversationId: string;
  readerId: string;
  upToMessageId: string;
  readAt: string;
}

export type PresenceStatus = 'online' | 'offline';

export interface PresenceUpdatePayload {
  userId: string;
  status: PresenceStatus;
  lastSeenAt?: string;
}

export interface MessageSendAck {
  ok: boolean;
  id?: string;
  sentAt?: string;
  error?: { code: string; message: string };
}

export interface ServerToClientEvents {
  'connection.ready': (payload: ConnectionReadyPayload) => void;
  'message.new': (payload: MessageNewPayload) => void;
  'message.delivered': (payload: MessageDeliveredPayload) => void;
  'message.read': (payload: MessageReadPayload) => void;
  'presence.update': (payload: PresenceUpdatePayload) => void;
}

export interface ClientToServerEvents {
  'message.send': (
    data: { conversationId: string; clientMessageId: string; body: string },
    callback: (ack: MessageSendAck) => void,
  ) => void;
  'message.read': (data: { conversationId: string; upToMessageId: string }) => void;
}

export type AppSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
