const pool = require('../config/db');
const { generateId } = require('../utils/uuid.util');

async function insertMany(listingId, urls, startSortOrder) {
  if (urls.length === 0) return;
  const values = [];
  const params = [];
  urls.forEach((url, index) => {
    values.push('(?, ?, ?, ?)');
    params.push(generateId(), listingId, url, startSortOrder + index);
  });
  await pool.query(`INSERT INTO listing_photos (id, listing_id, url, sort_order) VALUES ${values.join(', ')}`, params);
}

async function findByListingId(listingId) {
  const [rows] = await pool.query(
    'SELECT * FROM listing_photos WHERE listing_id = ? ORDER BY sort_order ASC, created_at ASC',
    [listingId],
  );
  return rows;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM listing_photos WHERE id = ?', [id]);
  return rows[0] || null;
}

async function countByListingId(listingId) {
  const [rows] = await pool.query('SELECT COUNT(*) AS count FROM listing_photos WHERE listing_id = ?', [listingId]);
  return rows[0].count;
}

async function remove(id) {
  await pool.query('DELETE FROM listing_photos WHERE id = ?', [id]);
}

module.exports = { insertMany, findByListingId, findById, countByListingId, remove };
