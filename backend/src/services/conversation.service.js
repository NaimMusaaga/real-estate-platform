const conversationRepository = require('../repositories/conversation.repository');
const messageRepository = require('../repositories/message.repository');
const listingRepository = require('../repositories/listing.repository');
const userRepository = require('../repositories/user.repository');
const AppError = require('../utils/AppError');
const { toConversationResponse } = require('../models/conversation.model');
const { toMessageResponse } = require('../models/message.model');

async function startOrGetConversation(seekerId, listingId) {
  const listingRow = await listingRepository.findById(listingId);
  if (!listingRow) {
    throw new AppError('Listing not found.', 404, 'NOT_FOUND');
  }
  const listing = listingRow.listing;

  if (listing.owner_id === seekerId) {
    throw new AppError('You cannot start a conversation about your own listing.', 400, 'VALIDATION_ERROR');
  }

  let conversation = await conversationRepository.findByListingAndSeeker(listingId, seekerId);
  let isNew = false;
  if (!conversation) {
    const id = await conversationRepository.create(listingId, listing.title, seekerId, listing.owner_id);
    conversation = await conversationRepository.findById(id);
    isNew = true;
  }

  return { conversation, isNew };
}

async function listConversations(userId) {
  const rows = await conversationRepository.listForUser(userId);
  const results = [];
  for (const row of rows) {
    const otherUserId = row.seeker_id === userId ? row.owner_id : row.seeker_id;
    const otherUser = await userRepository.findById(otherUserId);
    const lastMessage = await messageRepository.lastMessageFor(row.id);
    results.push(toConversationResponse(row, otherUser, lastMessage));
  }
  return results;
}

async function getMessages(conversationId, userId, before, limit) {
  const conversation = await conversationRepository.findById(conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found.', 404, 'NOT_FOUND');
  }
  if (conversation.seeker_id !== userId && conversation.owner_id !== userId) {
    throw new AppError('You are not a participant in this conversation.', 403, 'FORBIDDEN');
  }
  const rows = await messageRepository.listByConversation(conversationId, before, limit);
  return rows.map(toMessageResponse);
}

module.exports = { startOrGetConversation, listConversations, getMessages };
