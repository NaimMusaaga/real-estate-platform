const pool = require('../config/db');
const { generateId } = require('../utils/uuid.util');

async function create({ reporterId, reportedListingId, reason, description }) {
  const id = generateId();
  await pool.query(
    `INSERT INTO reports (id, reporter_id, reported_listing_id, reason, description)
     VALUES (?, ?, ?, ?, ?)`,
    [id, reporterId, reportedListingId, reason, description ?? null],
  );
  return id;
}

async function findPendingByReporterAndListing(reporterId, listingId) {
  const [rows] = await pool.query(
    "SELECT * FROM reports WHERE reporter_id = ? AND reported_listing_id = ? AND status = 'pending'",
    [reporterId, listingId],
  );
  return rows[0] || null;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM reports WHERE id = ?', [id]);
  return rows[0] || null;
}

async function listByStatus(status) {
  const [rows] = await pool.query(
    `SELECT
       r.*,
       reporter.display_name AS reporter_display_name, reporter.email AS reporter_email,
       l.title AS listing_title, l.status AS listing_status
     FROM reports r
     JOIN users reporter ON reporter.id = r.reporter_id
     LEFT JOIN listings l ON l.id = r.reported_listing_id
     WHERE r.status = ?
     ORDER BY r.created_at ASC`,
    [status],
  );
  return rows;
}

async function resolve(id, adminId, status, resolutionNote) {
  await pool.query(
    'UPDATE reports SET status = ?, resolved_by = ?, resolved_at = NOW(), resolution_note = ? WHERE id = ?',
    [status, adminId, resolutionNote ?? null, id],
  );
}

async function deleteByListingId(listingId) {
  await pool.query('DELETE FROM reports WHERE reported_listing_id = ?', [listingId]);
}

module.exports = { create, findPendingByReporterAndListing, findById, listByStatus, resolve, deleteByListingId };
