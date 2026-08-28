function toAuditLogEntry(row) {
  return {
    id: row.id,
    actionType: row.action_type,
    targetTable: row.target_table,
    targetId: row.target_id,
    targetDisplayName: row.target_display_name,
    reason: row.reason,
    createdAt: row.created_at,
    admin: {
      displayName: row.admin_display_name,
      email: row.admin_email,
    },
  };
}

module.exports = { toAuditLogEntry };
