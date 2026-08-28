const pool = require('../config/db');
const { generateId } = require('../utils/uuid.util');

async function create(userId, tokenType, tokenHash, expiresAt) {
  const id = generateId();
  await pool.query(
    'INSERT INTO user_tokens (id, user_id, token_type, token_hash, expires_at) VALUES (?, ?, ?, ?, ?)',
    [id, userId, tokenType, tokenHash, expiresAt],
  );
  return id;
}

async function findValid(tokenHash, tokenType) {
  const [rows] = await pool.query(
    `SELECT * FROM user_tokens
     WHERE token_hash = ? AND token_type = ? AND used_at IS NULL AND expires_at > NOW()`,
    [tokenHash, tokenType],
  );
  return rows[0] || null;
}

async function markUsed(id) {
  await pool.query('UPDATE user_tokens SET used_at = NOW() WHERE id = ?', [id]);
}

module.exports = { create, findValid, markUsed };
