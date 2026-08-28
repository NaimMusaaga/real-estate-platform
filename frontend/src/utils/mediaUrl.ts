export function resolveMediaUrl(path: string): string {
  return `${import.meta.env.VITE_SOCKET_URL}${path}`;
}
