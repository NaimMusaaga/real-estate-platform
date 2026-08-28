const { verifyToken } = require('../utils/jwt.util');

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Missing or invalid Authorization header.' } });
  }

  try {
    const payload = verifyToken(token);
    req.user = { id: payload.sub, role: payload.role };
    next();
  } catch (err) {
    return res.status(401).json({ error: { code: 'UNAUTHORIZED', message: 'Invalid or expired token.' } });
  }
}

module.exports = { requireAuth };
