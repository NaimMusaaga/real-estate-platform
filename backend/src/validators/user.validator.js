function validateUpdateProfile(req, res, next) {
  const { displayName, phone } = req.body || {};

  if (displayName !== undefined && (typeof displayName !== 'string' || displayName.trim().length === 0)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'displayName must be a non-empty string.' } });
  }
  if (phone !== undefined && typeof phone !== 'string') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'phone must be a string.' } });
  }

  next();
}

function validateChangePassword(req, res, next) {
  const { currentPassword, newPassword } = req.body || {};

  if (typeof currentPassword !== 'string' || currentPassword.length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'currentPassword is required.' } });
  }
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'newPassword must be at least 8 characters.' } });
  }

  next();
}

function validateSuspend(req, res, next) {
  const { reason } = req.body || {};
  if (typeof reason !== 'string' || reason.trim().length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'reason is required.' } });
  }
  next();
}

module.exports = { validateUpdateProfile, validateChangePassword, validateSuspend };
