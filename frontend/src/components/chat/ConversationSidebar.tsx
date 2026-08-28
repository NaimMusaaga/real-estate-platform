import { Link } from 'react-router-dom';
import type { ConversationSummary } from '../../types/conversation.types';
import { useSocket } from '../../hooks/useSocket';

interface ConversationSidebarProps {
  conversations: ConversationSummary[];
  activeId?: string;
}

export function ConversationSidebar({ conversations, activeId }: ConversationSidebarProps) {
  const { presenceMap } = useSocket();

  if (conversations.length === 0) {
    return <p className="p-6 text-center text-sm text-stone-400">لا توجد محادثات بعد.</p>;
  }

  return (
    <ul className="flex-1 overflow-y-auto">
      {conversations.map((c) => {
        const presence = c.otherUser ? presenceMap[c.otherUser.id] : undefined;
        const isActive = c.id === activeId;
        return (
          <li key={c.id}>
            <Link
              to={`/conversations/${c.id}`}
              className={`flex flex-col gap-1 border-b border-stone-100 px-4 py-3 transition-colors ${
                isActive ? 'bg-brand-50' : 'hover:bg-stone-50'
              }`}
            >
              <span className="flex items-center gap-1.5 font-semibold text-stone-900">
                <span
                  className={`h-2 w-2 rounded-full ${presence?.status === 'online' ? 'bg-green-500' : 'bg-stone-300'}`}
                  aria-hidden="true"
                />
                {c.otherUser?.displayName ?? 'مستخدم'}
              </span>
              <p className="truncate text-xs text-stone-500">
                {c.listingTitle}
                {!c.listingActive && ' (إعلان غير متاح)'}
              </p>
              {c.lastMessage && <p className="truncate text-sm text-stone-600">{c.lastMessage.body}</p>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
