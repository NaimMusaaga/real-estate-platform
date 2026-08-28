const pool = require('../config/db');
const { generateId } = require('../utils/uuid.util');

async function create(adminId, actionType, targetTable, targetId, reason) {
  const id = generateId();
  await pool.query(
    `INSERT INTO admin_audit_logs (id, admin_id, action_type, target_table, target_id, reason)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id, adminId, actionType, targetTable, targetId, reason ?? null],
  );
  return id;
}

async function listRecent(limit) {
  const [rows] = await pool.query(
    `SELECT
       al.id, al.action_type, al.target_table, al.target_id, al.reason, al.created_at,
       admin.display_name AS admin_display_name, admin.email AS admin_email,
       COALESCE(target_user.display_name, target_listing.title) AS target_display_name
     FROM admin_audit_logs al
     JOIN users admin ON admin.id = al.admin_id
     LEFT JOIN users target_user ON target_user.id = al.target_id AND al.target_table = 'users'
     LEFT JOIN listings target_listing ON target_listing.id = al.target_id AND al.target_table = 'listings'
     ORDER BY al.created_at DESC
     LIMIT ?`,
    [limit],
  );
  return rows;
}

module.exports = { create, listRecent };
