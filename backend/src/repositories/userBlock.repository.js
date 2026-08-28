const pool = require('../config/db');

async function block(blockerId, blockedId) {
  await pool.query('INSERT IGNORE INTO user_blocks (blocker_id, blocked_id) VALUES (?, ?)', [blockerId, blockedId]);
}

async function unblock(blockerId, blockedId) {
  await pool.query('DELETE FROM user_blocks WHERE blocker_id = ? AND blocked_id = ?', [blockerId, blockedId]);
}

async function isBlocked(userAId, userBId) {
  const [rows] = await pool.query(
    `SELECT 1 FROM user_blocks
     WHERE (blocker_id = ? AND blocked_id = ?) OR (blocker_id = ? AND blocked_id = ?)
     LIMIT 1`,
    [userAId, userBId, userBId, userAId],
  );
  return rows.length > 0;
}

async function hasBlocked(blockerId, blockedId) {
  const [rows] = await pool.query(
    'SELECT 1 FROM user_blocks WHERE blocker_id = ? AND blocked_id = ? LIMIT 1',
    [blockerId, blockedId],
  );
  return rows.length > 0;
}

module.exports = { block, unblock, isBlocked, hasBlocked };
