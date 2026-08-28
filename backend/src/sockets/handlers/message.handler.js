const messageService = require('../../services/message.service');
const presence = require('../presence');
const rateLimiter = require('../rateLimiter');

function registerMessageHandlers(io, socket) {
  const userId = socket.userId;

  socket.on('message.send', async (data, callback) => {
    const respond = typeof callback === 'function' ? callback : () => {};
    try {
      const { conversationId, body } = data || {};

      if (!rateLimiter.allow(userId)) {
        return respond({ ok: false, error: { code: 'RATE_LIMITED', message: 'Too many messages, slow down.' } });
      }

      const { message, otherUserId } = await messageService.sendMessage(userId, conversationId, body);

      respond({ ok: true, id: message.id, sentAt: message.sentAt });

      io.to(`conversation:${conversationId}`).emit('message.new', {
        id: message.id,
        conversationId,
        senderId: userId,
        body: message.body,
        sentAt: message.sentAt,
      });

      // "Delivered" is approximated as "recipient currently online" rather than a true
      // client-side receipt ack — a deliberate simplification (see Step 5 micro plan).
      if (presence.isOnline(otherUserId)) {
        const deliveredAt = await messageService.markDelivered(message.id);
        io.to(`conversation:${conversationId}`).emit('message.delivered', {
          conversationId,
          messageId: message.id,
          deliveredAt,
        });
      }
    } catch (err) {
      respond({ ok: false, error: { code: err.code || 'ERROR', message: err.message || 'Something went wrong.' } });
    }
  });

  socket.on('message.read', async (data) => {
    try {
      const { conversationId, upToMessageId } = data || {};
      const readAt = await messageService.markRead(userId, conversationId, upToMessageId);
      io.to(`conversation:${conversationId}`).emit('message.read', {
        conversationId,
        readerId: userId,
        upToMessageId,
        readAt,
      });
    } catch (err) {
      console.error('message.read failed:', err.message);
    }
  });
}

module.exports = { registerMessageHandlers };
