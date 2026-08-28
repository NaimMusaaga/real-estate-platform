const pool = require('../config/db');
const { generateId } = require('../utils/uuid.util');

async function create(conversationId, senderId, body) {
  const id = generateId();
  await pool.query(
    'INSERT INTO messages (id, conversation_id, sender_id, body) VALUES (?, ?, ?, ?)',
    [id, conversationId, senderId, body],
  );
  const [rows] = await pool.query('SELECT * FROM messages WHERE id = ?', [id]);
  return rows[0];
}

async function markDelivered(id) {
  await pool.query('UPDATE messages SET delivered_at = NOW() WHERE id = ?', [id]);
  const [rows] = await pool.query('SELECT delivered_at FROM messages WHERE id = ?', [id]);
  return rows[0].delivered_at;
}

async function markReadUpTo(conversationId, readerId, upToMessageId) {
  await pool.query(
    `UPDATE messages SET read_at = NOW()
     WHERE conversation_id = ? AND sender_id <> ? AND read_at IS NULL
       AND sent_at <= (SELECT sent_at FROM messages WHERE id = ?)`,
    [conversationId, readerId, upToMessageId],
  );
  const [rows] = await pool.query('SELECT read_at FROM messages WHERE id = ?', [upToMessageId]);
  return rows[0]?.read_at;
}

async function listByConversation(conversationId, before, limit) {
  if (before) {
    const [rows] = await pool.query(
      'SELECT * FROM messages WHERE conversation_id = ? AND sent_at < ? ORDER BY sent_at DESC LIMIT ?',
      [conversationId, before, limit],
    );
    return rows.reverse();
  }
  const [rows] = await pool.query(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at DESC LIMIT ?',
    [conversationId, limit],
  );
  return rows.reverse();
}

async function lastMessageFor(conversationId) {
  const [rows] = await pool.query(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY sent_at DESC LIMIT 1',
    [conversationId],
  );
  return rows[0] || null;
}

async function countUnreadForUser(userId) {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS count FROM messages m
     JOIN conversations c ON c.id = m.conversation_id
     WHERE (c.seeker_id = ? OR c.owner_id = ?) AND m.sender_id <> ? AND m.read_at IS NULL`,
    [userId, userId, userId],
  );
  return rows[0].count;
}

async function countAll() {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM messages');
  return rows[0].count;
}

module.exports = {
  create,
  markDelivered,
  markReadUpTo,
  listByConversation,
  lastMessageFor,
  countUnreadForUser,
  countAll,
};
