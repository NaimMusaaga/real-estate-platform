const conversationRepository = require('../repositories/conversation.repository');
const messageRepository = require('../repositories/message.repository');
const userBlockRepository = require('../repositories/userBlock.repository');
const AppError = require('../utils/AppError');
const { toMessageResponse } = require('../models/message.model');

function assertParticipant(conversation, userId) {
  if (!conversation || (conversation.seeker_id !== userId && conversation.owner_id !== userId)) {
    throw new AppError('Not a participant in this conversation.', 403, 'NOT_PARTICIPANT');
  }
}

function otherParticipant(conversation, userId) {
  return conversation.seeker_id === userId ? conversation.owner_id : conversation.seeker_id;
}

async function sendMessage(userId, conversationId, body) {
  if (typeof body !== 'string' || body.trim().length === 0) {
    throw new AppError('Message body is required.', 400, 'VALIDATION_ERROR');
  }

  const conversation = await conversationRepository.findById(conversationId);
  assertParticipant(conversation, userId);

  const otherUserId = otherParticipant(conversation, userId);
  const blocked = await userBlockRepository.isBlocked(userId, otherUserId);
  if (blocked) {
    throw new AppError('You cannot message this user.', 403, 'BLOCKED');
  }

  const row = await messageRepository.create(conversationId, userId, body.trim());
  return { message: toMessageResponse(row), otherUserId };
}

async function markDelivered(messageId) {
  return messageRepository.markDelivered(messageId);
}

async function markRead(userId, conversationId, upToMessageId) {
  const conversation = await conversationRepository.findById(conversationId);
  assertParticipant(conversation, userId);
  return messageRepository.markReadUpTo(conversationId, userId, upToMessageId);
}

module.exports = { sendMessage, markDelivered, markRead };
