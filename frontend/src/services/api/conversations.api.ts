import apiClient from './apiClient';
import type { ConversationSummary, Message, StartConversationResponse } from '../../types/conversation.types';

export async function startConversation(listingId: string): Promise<StartConversationResponse> {
  const { data } = await apiClient.post<StartConversationResponse>('/conversations', { listingId });
  return data;
}

export async function listConversations(): Promise<ConversationSummary[]> {
  const { data } = await apiClient.get<ConversationSummary[]>('/conversations');
  return data;
}

export async function getMessages(conversationId: string, before?: string): Promise<Message[]> {
  const { data } = await apiClient.get<Message[]>(`/conversations/${conversationId}/messages`, {
    params: before ? { before } : {},
  });
  return data;
}
