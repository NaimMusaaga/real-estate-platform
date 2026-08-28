// Sliding-window rate limit for message.send: 10 messages / 10s per user (NFR-SEC-6).
// In-memory, same reasoning as presence.js — fine at MVP's single-instance scale.
const windows = new Map();

const LIMIT = 10;
const WINDOW_MS = 10000;

function allow(userId) {
  const now = Date.now();
  const timestamps = (windows.get(userId) || []).filter((t) => now - t < WINDOW_MS);
  if (timestamps.length >= LIMIT) {
    windows.set(userId, timestamps);
    return false;
  }
  timestamps.push(now);
  windows.set(userId, timestamps);
  return true;
}

module.exports = { allow };
