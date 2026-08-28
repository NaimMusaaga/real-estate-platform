import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useSocket } from '../../hooks/useSocket';
import * as conversationsApi from '../../services/api/conversations.api';
import * as usersApi from '../../services/api/users.api';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { PresenceIndicator } from './PresenceIndicator';
import { Button } from '../common/Button';
import { Spinner } from '../common/Spinner';
import type { ConversationSummary, Message } from '../../types/conversation.types';
import type { MessageDeliveredPayload, MessageNewPayload, MessageReadPayload } from '../../types/socket.types';

interface ChatWindowProps {
  conversation: ConversationSummary;
  onBack: () => void;
}

export function ChatWindow({ conversation, onBack }: ChatWindowProps) {
  const { user } = useAuth();
  const { socket, presenceMap } = useSocket();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [blockedByMe, setBlockedByMe] = useState(false);
  const [blockedByOther, setBlockedByOther] = useState(false);
  const [blockActionLoading, setBlockActionLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastReadSentRef = useRef<string | null>(null);

  const otherUserId = conversation.otherUser?.id;

  useEffect(() => {
    setLoading(true);
    conversationsApi.getMessages(conversation.id).then((msgs) => {
      setMessages(msgs);
      setLoading(false);
    });
  }, [conversation.id]);

  useEffect(() => {
    if (!otherUserId) return;
    usersApi.getBlockStatus(otherUserId).then((status) => {
      setBlockedByMe(status.blockedByMe);
      setBlockedByOther(status.blockedByOther);
    });
  }, [otherUserId]);

  useEffect(() => {
    if (!socket) return;

    function handleNew(msg: MessageNewPayload) {
      if (msg.conversationId !== conversation.id) return;
      setMessages((prev) => [...prev, { ...msg, deliveredAt: null, readAt: null }]);
    }

    function handleDelivered(payload: MessageDeliveredPayload) {
      if (payload.conversationId !== conversation.id) return;
      setMessages((prev) =>
        prev.map((m) => (m.id === payload.messageId ? { ...m, deliveredAt: payload.deliveredAt } : m)),
      );
    }

    function handleRead(payload: MessageReadPayload) {
      if (payload.conversationId !== conversation.id || payload.readerId === user?.id) return;
      setMessages((prev) => {
        const target = prev.find((m) => m.id === payload.upToMessageId);
        if (!target) return prev;
        return prev.map((m) =>
          m.senderId === user?.id && m.sentAt <= target.sentAt ? { ...m, readAt: payload.readAt } : m,
        );
      });
    }

    socket.on('message.new', handleNew);
    socket.on('message.delivered', handleDelivered);
    socket.on('message.read', handleRead);

    return () => {
      socket.off('message.new', handleNew);
      socket.off('message.delivered', handleDelivered);
      socket.off('message.read', handleRead);
    };
  }, [socket, conversation.id, user?.id]);

  useEffect(() => {
    if (!socket || messages.length === 0 || !user) return;
    const lastFromOther = [...messages].reverse().find((m) => m.senderId !== user.id);
    if (lastFromOther && lastFromOther.id !== lastReadSentRef.current) {
      socket.emit('message.read', { conversationId: conversation.id, upToMessageId: lastFromOther.id });
      lastReadSentRef.current = lastFromOther.id;
    }
  }, [socket, messages, conversation.id, user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  function handleSend(body: string) {
    if (!socket) return;
    socket.emit('message.send', { conversationId: conversation.id, clientMessageId: `tmp-${Date.now()}`, body }, (ack) => {
      if (!ack.ok && ack.error) {
        alert(ack.error.message);
      }
    });
  }

  async function handleToggleBlock() {
    if (!otherUserId) return;
    setBlockActionLoading(true);
    try {
      if (blockedByMe) {
        await usersApi.unblockUser(otherUserId);
        setBlockedByMe(false);
      } else {
        await usersApi.blockUser(otherUserId);
        setBlockedByMe(true);
      }
    } finally {
      setBlockActionLoading(false);
    }
  }

  const presence = otherUserId ? presenceMap[otherUserId] : undefined;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-2 border-b border-stone-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="rounded-lg p-1.5 hover:bg-stone-100 sm:hidden" aria-label="عودة لقائمة المحادثات">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 rotate-180" aria-hidden="true">
              <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div>
            <p className="font-bold text-stone-900">{conversation.otherUser?.displayName ?? 'مستخدم'}</p>
            <PresenceIndicator presence={presence} />
          </div>
        </div>
        {otherUserId && (
          <Button variant="outline" size="sm" onClick={handleToggleBlock} isLoading={blockActionLoading}>
            {blockedByMe ? 'إلغاء الحظر' : 'حظر المستخدم'}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner className="text-brand-600" />
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} isMine={m.senderId === user?.id} />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <MessageInput
        onSend={handleSend}
        disabled={blockedByMe || blockedByOther}
        disabledReason={blockedByMe ? 'قمت بحظر هذا المستخدم' : 'لا يمكنك إرسال رسائل لهذا المستخدم'}
      />
    </div>
  );
}
