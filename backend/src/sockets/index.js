const { Server } = require('socket.io');
const { socketAuthMiddleware } = require('./socketAuth.middleware');
const { registerMessageHandlers } = require('./handlers/message.handler');
const presenceHandler = require('./handlers/presence.handler');
const conversationRepository = require('../repositories/conversation.repository');
const presence = require('./presence');

let io;

function initSocketServer(httpServer, corsOrigin) {
  io = new Server(httpServer, { cors: { origin: corsOrigin } });

  io.use(socketAuthMiddleware);

  io.on('connection', async (socket) => {
    const userId = socket.userId;
    // Full rows, not just ids — needed to work out who "the other participant" is
    // per conversation, for the initial presence snapshot below.
    const conversations = await conversationRepository.listForUser(userId);
    const conversationIds = conversations.map((c) => c.id);

    socket.join(`user:${userId}`);
    conversationIds.forEach((id) => socket.join(`conversation:${id}`));

    await presenceHandler.handleConnect(io, socket, conversationIds);

    // Presence only ever broadcasts on change, so a client connecting *after* someone
    // else came online would otherwise never learn they're online until the next
    // change event. This snapshot closes that gap for everyone already in a shared
    // conversation at connect time.
    const initialPresence = {};
    for (const conv of conversations) {
      const otherUserId = conv.seeker_id === userId ? conv.owner_id : conv.seeker_id;
      if (presence.isOnline(otherUserId)) {
        initialPresence[otherUserId] = { status: 'online' };
      }
    }

    socket.emit('connection.ready', { userId, subscribedConversations: conversationIds, presence: initialPresence });

    registerMessageHandlers(io, socket);

    socket.on('disconnect', () => {
      presenceHandler.handleDisconnect(io, socket, conversationIds);
    });
  });

  return io;
}

function getIO() {
  return io;
}

module.exports = { initSocketServer, getIO, presence };
