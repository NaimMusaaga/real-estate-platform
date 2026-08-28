const pool = require('../config/db');
const { generateId } = require('../utils/uuid.util');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create({ email, passwordHash, displayName }) {
  const id = generateId();
  await pool.query(
    `INSERT INTO users (id, email, password_hash, display_name, role, status)
     VALUES (?, ?, ?, ?, 'user', 'active')`,
    [id, email, passwordHash, displayName],
  );
  return id;
}

async function markEmailVerified(userId) {
  await pool.query('UPDATE users SET email_verified_at = NOW() WHERE id = ?', [userId]);
}

async function updateProfile(userId, fields) {
  const updatable = { displayName: 'display_name', phone: 'phone' };
  const setClauses = [];
  const params = [];
  for (const [key, column] of Object.entries(updatable)) {
    if (fields[key] !== undefined) {
      setClauses.push(`${column} = ?`);
      params.push(fields[key]);
    }
  }
  if (setClauses.length === 0) return;
  params.push(userId);
  await pool.query(`UPDATE users SET ${setClauses.join(', ')} WHERE id = ?`, params);
}

async function updatePasswordHash(userId, passwordHash) {
  await pool.query('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
}

async function updateStatus(userId, status) {
  await pool.query('UPDATE users SET status = ? WHERE id = ?', [status, userId]);
}

async function updateLastSeen(userId) {
  await pool.query('UPDATE users SET last_seen_at = NOW() WHERE id = ?', [userId]);
}

async function countByStatusAndRole() {
  const [rows] = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'active') AS active,
       SUM(status = 'suspended') AS suspended,
       SUM(role = 'admin') AS admins,
       SUM(listing_flag_status = 'flagged_for_review') AS flagged
     FROM users`,
  );
  return rows[0];
}

async function listAll() {
  const [rows] = await pool.query(
    `SELECT id, email, display_name, phone, role, status, listing_flag_status, email_verified_at, created_at
     FROM users ORDER BY created_at DESC`,
  );
  return rows;
}

module.exports = {
  findByEmail,
  findById,
  create,
  markEmailVerified,
  updateProfile,
  updatePasswordHash,
  updateStatus,
  updateLastSeen,
  listAll,
  countByStatusAndRole,
};
