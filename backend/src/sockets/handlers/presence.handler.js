const userRepository = require('../../repositories/user.repository');
const presence = require('../presence');

async function handleConnect(io, socket, conversationIds) {
  const justCameOnline = presence.addSocket(socket.userId, socket.id);
  if (justCameOnline) {
    conversationIds.forEach((id) => {
      io.to(`conversation:${id}`).emit('presence.update', { userId: socket.userId, status: 'online' });
    });
  }
}

async function handleDisconnect(io, socket, conversationIds) {
  const justWentOffline = presence.removeSocket(socket.userId, socket.id);
  if (justWentOffline) {
    await userRepository.updateLastSeen(socket.userId);
    conversationIds.forEach((id) => {
      io.to(`conversation:${id}`).emit('presence.update', {
        userId: socket.userId,
        status: 'offline',
        lastSeenAt: new Date().toISOString(),
      });
    });
  }
}

module.exports = { handleConnect, handleDisconnect };
