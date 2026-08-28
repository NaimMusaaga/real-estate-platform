const conversationService = require('../services/conversation.service');
const { getIO, presence } = require('../sockets');

async function startConversation(req, res, next) {
  try {
    const { listingId } = req.body;
    const { conversation, isNew } = await conversationService.startOrGetConversation(req.user.id, listingId);

    if (isNew) {
      const io = getIO();
      if (io) {
        [conversation.seeker_id, conversation.owner_id].forEach((uid) => {
          presence.getSocketIds(uid).forEach((socketId) => {
            const socket = io.sockets.sockets.get(socketId);
            if (socket) socket.join(`conversation:${conversation.id}`);
          });
        });
      }
    }

    res.status(isNew ? 201 : 200).json({
      id: conversation.id,
      listingId: conversation.listing_id,
      listingTitle: conversation.listing_title_snapshot,
      seekerId: conversation.seeker_id,
      ownerId: conversation.owner_id,
    });
  } catch (err) {
    next(err);
  }
}

async function listConversations(req, res, next) {
  try {
    const conversations = await conversationService.listConversations(req.user.id);
    res.json(conversations);
  } catch (err) {
    next(err);
  }
}

async function getMessages(req, res, next) {
  try {
    const { before, limit } = req.query;
    const messages = await conversationService.getMessages(
      req.params.id,
      req.user.id,
      before ? new Date(before) : null,
      Math.min(Number(limit) || 50, 100),
    );
    res.json(messages);
  } catch (err) {
    next(err);
  }
}

module.exports = { startConversation, listConversations, getMessages };
