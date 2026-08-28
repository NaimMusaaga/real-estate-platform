export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('ar-SY', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date(iso));
}

export function formatDateTime(iso: string): string {
  return new Intl.DateTimeFormat('ar-SY', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(iso));
}
