const reportService = require('../services/report.service');

async function create(req, res, next) {
  try {
    await reportService.createReport(req.user.id, req.body);
    res.status(201).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create };
