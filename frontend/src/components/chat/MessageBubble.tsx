import type { Message } from '../../types/conversation.types';

function formatTime(iso: string): string {
  return new Intl.DateTimeFormat('ar-SY', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
}

interface MessageBubbleProps {
  message: Message;
  isMine: boolean;
}

export function MessageBubble({ message, isMine }: MessageBubbleProps) {
  // Mirrors the LTR chat convention through logical alignment, not a literal side:
  // "my" messages sit at the inline-end (visually LEFT under RTL), the same relative
  // position they'd have in an LTR app — not simply flipped without thought.
  const receipt = message.readAt ? 'read' : message.deliveredAt ? 'delivered' : 'sent';

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
          isMine ? 'bg-brand-600 text-white' : 'bg-stone-100 text-stone-900'
        }`}
      >
        <p className="whitespace-pre-line">{message.body}</p>
        <div className={`mt-1 flex items-center gap-1 text-[11px] ${isMine ? 'text-brand-100' : 'text-stone-400'}`}>
          <span>{formatTime(message.sentAt)}</span>
          {isMine && (
            <span
              aria-label={receipt === 'read' ? 'مقروءة' : receipt === 'delivered' ? 'تم التسليم' : 'تم الإرسال'}
              className={receipt === 'read' ? 'text-sky-300' : ''}
            >
              {receipt === 'sent' ? '✓' : '✓✓'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
