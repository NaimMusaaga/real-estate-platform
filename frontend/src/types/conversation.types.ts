export interface StartConversationResponse {
  id: string;
  listingId: string | null;
  listingTitle: string;
  seekerId: string;
  ownerId: string;
}

export interface ConversationOtherUser {
  id: string;
  displayName: string;
}

export interface ConversationLastMessage {
  body: string;
  sentAt: string;
  senderId: string;
}

export interface ConversationSummary {
  id: string;
  listingId: string | null;
  listingTitle: string;
  listingActive: boolean;
  otherUser: ConversationOtherUser | null;
  lastMessage: ConversationLastMessage | null;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  sentAt: string;
  deliveredAt: string | null;
  readAt: string | null;
}
