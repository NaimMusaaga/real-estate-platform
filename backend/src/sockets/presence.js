// In-memory presence store: userId -> Set<socketId>. Deliberately not in the
// database — see NFR-SCALE-4 / system-architecture.md. Supports multiple
// concurrent connections (tabs/devices) per user without flapping presence.
const onlineUsers = new Map();

function addSocket(userId, socketId) {
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socketId);
  return onlineUsers.get(userId).size === 1; // true if this is the first connection (just came online)
}

function removeSocket(userId, socketId) {
  const set = onlineUsers.get(userId);
  if (!set) return false;
  set.delete(socketId);
  if (set.size === 0) {
    onlineUsers.delete(userId);
    return true; // true if that was the last connection (just went offline)
  }
  return false;
}

function isOnline(userId) {
  return onlineUsers.has(userId);
}

function getSocketIds(userId) {
  return onlineUsers.get(userId) || new Set();
}

module.exports = { addSocket, removeSocket, isOnline, getSocketIds };
