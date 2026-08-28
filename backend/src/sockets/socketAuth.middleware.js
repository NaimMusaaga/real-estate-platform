const { verifyToken } = require('../utils/jwt.util');

function socketAuthMiddleware(socket, next) {
  const token = socket.handshake.auth?.token;
  if (!token) {
    return next(new Error('AUTH_REQUIRED'));
  }
  try {
    const payload = verifyToken(token);
    socket.userId = payload.sub;
    socket.userRole = payload.role;
    next();
  } catch (err) {
    next(new Error('AUTH_EXPIRED'));
  }
}

module.exports = { socketAuthMiddleware };
