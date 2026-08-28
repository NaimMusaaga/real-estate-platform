function toReportResponse(row) {
  return {
    id: row.id,
    reason: row.reason,
    description: row.description,
    status: row.status,
    resolvedBy: row.resolved_by,
    resolvedAt: row.resolved_at,
    resolutionNote: row.resolution_note,
    createdAt: row.created_at,
    reporter: {
      displayName: row.reporter_display_name,
      email: row.reporter_email,
    },
    listing: row.reported_listing_id
      ? { id: row.reported_listing_id, title: row.listing_title, status: row.listing_status }
      : null,
  };
}

module.exports = { toReportResponse };
