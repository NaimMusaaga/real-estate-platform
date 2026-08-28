import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { ConversationSidebar } from '../components/chat/ConversationSidebar';
import { ChatWindow } from '../components/chat/ChatWindow';
import { Spinner } from '../components/common/Spinner';
import { useSocket } from '../hooks/useSocket';
import * as conversationsApi from '../services/api/conversations.api';
import type { ConversationSummary } from '../types/conversation.types';
import type { MessageNewPayload } from '../types/socket.types';

export default function ChatInboxPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    conversationsApi.listConversations().then((data) => {
      setConversations(data);
      setLoading(false);
    });
  }, []);

  // Keeps the sidebar's last-message preview live across every conversation,
  // not just the one currently open — ChatWindow handles its own thread separately.
  useEffect(() => {
    if (!socket) return;
    function handleNew(msg: MessageNewPayload) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === msg.conversationId
            ? { ...c, lastMessage: { body: msg.body, sentAt: msg.sentAt, senderId: msg.senderId } }
            : c,
        ),
      );
    }
    socket.on('message.new', handleNew);
    return () => {
      socket.off('message.new', handleNew);
    };
  }, [socket]);

  const activeConversation = conversations.find((c) => c.id === id) ?? null;

  return (
    <div className="flex h-screen flex-col bg-stone-50">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 overflow-hidden sm:px-4 sm:py-4">
        <div className="flex w-full overflow-hidden border-stone-200 bg-white sm:rounded-2xl sm:border sm:shadow-sm">
          <div className={`w-full shrink-0 border-e border-stone-200 sm:w-80 ${id ? 'hidden sm:flex' : 'flex'} flex-col`}>
            {loading ? (
              <div className="flex flex-1 items-center justify-center">
                <Spinner className="text-brand-600" />
              </div>
            ) : (
              <ConversationSidebar conversations={conversations} activeId={id} />
            )}
          </div>

          <div className={`flex-1 flex-col ${id ? 'flex' : 'hidden sm:flex'}`}>
            {activeConversation ? (
              <ChatWindow conversation={activeConversation} onBack={() => navigate('/conversations')} />
            ) : (
              <div className="flex flex-1 items-center justify-center p-8 text-center text-stone-400">
                {!loading && 'اختر محادثة لعرضها'}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
