function toConversationResponse(row, otherUser, lastMessage) {
  return {
    id: row.id,
    listingId: row.listing_id,
    listingTitle: row.listing_title_snapshot,
    listingActive: row.listing_id !== null,
    otherUser: otherUser ? { id: otherUser.id, displayName: otherUser.display_name } : null,
    lastMessage: lastMessage
      ? { body: lastMessage.body, sentAt: lastMessage.sent_at, senderId: lastMessage.sender_id }
      : null,
    createdAt: row.created_at,
  };
}

module.exports = { toConversationResponse };
