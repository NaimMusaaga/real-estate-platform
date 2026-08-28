import type { PresenceInfo } from '../../context/SocketContext';

function formatLastSeen(iso: string): string {
  return new Intl.DateTimeFormat('ar-SY', { dateStyle: 'short', timeStyle: 'short' }).format(new Date(iso));
}

export function PresenceIndicator({ presence }: { presence?: PresenceInfo }) {
  if (!presence) return null;

  if (presence.status === 'online') {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
        <span className="h-1.5 w-1.5 rounded-full bg-green-500" aria-hidden="true" />
        متصل الآن
      </span>
    );
  }

  if (presence.lastSeenAt) {
    return <span className="text-xs text-stone-400">آخر ظهور: {formatLastSeen(presence.lastSeenAt)}</span>;
  }

  return null;
}
