const userRepository = require('../repositories/user.repository');
const listingRepository = require('../repositories/listing.repository');
const conversationRepository = require('../repositories/conversation.repository');
const messageRepository = require('../repositories/message.repository');

// MySQL returns SUM(...) as a string (DECIMAL), unlike COUNT(*) — normalize everything
// to real numbers so the API never leaks driver quirks into the JSON response.
function n(value) {
  return Number(value) || 0;
}

async function getMyStats(userId) {
  const [activeListingsCount, conversationsCount, unreadMessagesCount] = await Promise.all([
    listingRepository.countActiveByOwner(userId),
    conversationRepository.countForUser(userId),
    messageRepository.countUnreadForUser(userId),
  ]);

  return {
    activeListingsCount: n(activeListingsCount),
    conversationsCount: n(conversationsCount),
    unreadMessagesCount: n(unreadMessagesCount),
  };
}

async function getAdminStats() {
  const [userCounts, listingCounts, conversationsTotal, messagesTotal] = await Promise.all([
    userRepository.countByStatusAndRole(),
    listingRepository.countByStatusAndType(),
    conversationRepository.countAll(),
    messageRepository.countAll(),
  ]);

  return {
    users: {
      total: n(userCounts.total),
      active: n(userCounts.active),
      suspended: n(userCounts.suspended),
      admins: n(userCounts.admins),
      flaggedForReview: n(userCounts.flagged),
    },
    listings: {
      total: n(listingCounts.total),
      active: n(listingCounts.active),
      soldOrRented: n(listingCounts.soldOrRented),
      archived: n(listingCounts.archived),
      byPropertyType: {
        residential: n(listingCounts.residential),
        commercial: n(listingCounts.commercial),
        land: n(listingCounts.land),
      },
    },
    conversations: { total: n(conversationsTotal) },
    messages: { total: n(messagesTotal) },
  };
}

async function getPublicStats() {
  const [userCounts, listingCounts] = await Promise.all([
    userRepository.countByStatusAndRole(),
    listingRepository.countByStatusAndType(),
  ]);

  return {
    activeListingsCount: n(listingCounts.active),
    activeUsersCount: n(userCounts.active),
  };
}

module.exports = { getMyStats, getAdminStats, getPublicStats };
