function toProfile(row) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    phone: row.phone,
    role: row.role,
    status: row.status,
  };
}

function toAdminSummary(row) {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    phone: row.phone,
    role: row.role,
    status: row.status,
    listingFlagStatus: row.listing_flag_status,
    emailVerified: !!row.email_verified_at,
    createdAt: row.created_at,
  };
}

module.exports = { toProfile, toAdminSummary };
