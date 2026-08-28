const pool = require('../config/db');
const { generateId } = require('../utils/uuid.util');

async function findByListingAndSeeker(listingId, seekerId) {
  const [rows] = await pool.query(
    'SELECT * FROM conversations WHERE listing_id = ? AND seeker_id = ?',
    [listingId, seekerId],
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM conversations WHERE id = ?', [id]);
  return rows[0] || null;
}

async function create(listingId, listingTitle, seekerId, ownerId) {
  const id = generateId();
  await pool.query(
    `INSERT INTO conversations (id, listing_id, listing_title_snapshot, seeker_id, owner_id)
     VALUES (?, ?, ?, ?, ?)`,
    [id, listingId, listingTitle, seekerId, ownerId],
  );
  return id;
}

async function listForUser(userId) {
  const [rows] = await pool.query(
    'SELECT * FROM conversations WHERE seeker_id = ? OR owner_id = ? ORDER BY created_at DESC',
    [userId, userId],
  );
  return rows;
}

async function listConversationIdsForUser(userId) {
  const [rows] = await pool.query(
    'SELECT id FROM conversations WHERE seeker_id = ? OR owner_id = ?',
    [userId, userId],
  );
  return rows.map((r) => r.id);
}

async function countForUser(userId) {
  const [rows] = await pool.query(
    'SELECT COUNT(*) AS count FROM conversations WHERE seeker_id = ? OR owner_id = ?',
    [userId, userId],
  );
  return rows[0].count;
}

async function countAll() {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM conversations');
  return rows[0].count;
}

module.exports = {
  findByListingAndSeeker,
  findById,
  create,
  listForUser,
  listConversationIdsForUser,
  countForUser,
  countAll,
};
