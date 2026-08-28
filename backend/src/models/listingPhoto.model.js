function toListingPhotoResponse(row) {
  return {
    id: row.id,
    url: row.url,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

module.exports = { toListingPhotoResponse };
