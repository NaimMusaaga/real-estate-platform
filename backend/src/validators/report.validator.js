const { REPORT_REASONS } = require('../config/constants');

function validateCreateReport(req, res, next) {
  const { reportedListingId, reason, description } = req.body || {};

  if (typeof reportedListingId !== 'string' || reportedListingId.trim().length === 0) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'reportedListingId is required.' } });
  }
  if (!REPORT_REASONS.includes(reason)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'Invalid reason.' } });
  }
  if (description !== undefined && description !== null && typeof description !== 'string') {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'description must be a string.' } });
  }

  next();
}

function validateReportAction(req, res, next) {
  const { action } = req.body || {};
  if (!['archive', 'remove'].includes(action)) {
    return res.status(400).json({ error: { code: 'VALIDATION_ERROR', message: 'action must be "archive" or "remove".' } });
  }
  next();
}

module.exports = { validateCreateReport, validateReportAction };
