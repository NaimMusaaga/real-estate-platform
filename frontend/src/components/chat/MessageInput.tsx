import { useState } from 'react';
import type { FormEvent } from 'react';

interface MessageInputProps {
  onSend: (body: string) => void;
  disabled?: boolean;
  disabledReason?: string;
}

export function MessageInput({ onSend, disabled = false, disabledReason }: MessageInputProps) {
  const [body, setBody] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!body.trim() || disabled) return;
    onSend(body);
    setBody('');
  }

  if (disabled) {
    return <p className="border-t border-stone-200 p-3 text-center text-sm text-stone-400">{disabledReason}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-stone-200 p-3">
      <input
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="اكتب رسالة..."
        aria-label="اكتب رسالة"
        className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      />
      <button
        type="submit"
        className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
      >
        إرسال
      </button>
    </form>
  );
}
