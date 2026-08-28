function validateStartConversation(req, res, next) {
  const { listingId } = req.body || {};
  if (typeof listingId !== 'string' || listingId.length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'listingId is required.' } });
  }
  next();
}

module.exports = { validateStartConversation };
