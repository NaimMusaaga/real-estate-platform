const statsService = require('../services/stats.service');

async function getPublicStats(req, res, next) {
  try {
    const stats = await statsService.getPublicStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = { getPublicStats };
