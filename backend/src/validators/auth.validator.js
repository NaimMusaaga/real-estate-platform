function validateLogin(req, res, next) {
  const { email, password } = req.body || {};

  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A valid email is required.' } });
  }

  if (typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password is required.' } });
  }

  next();
}

function validateRegister(req, res, next) {
  const { email, password, displayName } = req.body || {};

  if (typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'A valid email is required.' } });
  }
  if (typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters.' } });
  }
  if (typeof displayName !== 'string' || displayName.trim().length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'displayName is required.' } });
  }

  next();
}

function validateVerifyEmail(req, res, next) {
  const { token } = req.body || {};
  if (typeof token !== 'string' || token.length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'token is required.' } });
  }
  next();
}

module.exports = { validateLogin, validateRegister, validateVerifyEmail };
