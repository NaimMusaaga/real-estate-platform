const userService = require('../services/user.service');
const statsService = require('../services/stats.service');
const reportService = require('../services/report.service');

async function listUsers(req, res, next) {
  try {
    const users = await userService.listUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

async function suspendUser(req, res, next) {
  try {
    await userService.suspendUser(req.params.id, req.user, req.body.reason);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function reinstateUser(req, res, next) {
  try {
    await userService.reinstateUser(req.params.id, req.user);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getStats(req, res, next) {
  try {
    const stats = await statsService.getAdminStats();
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

async function listAuditLogs(req, res, next) {
  try {
    const logs = await userService.listAuditLogs();
    res.status(200).json(logs);
  } catch (err) {
    next(err);
  }
}

async function listReports(req, res, next) {
  try {
    const status = req.query.status || 'pending';
    const reports = await reportService.listReports(status);
    res.status(200).json(reports);
  } catch (err) {
    next(err);
  }
}

async function dismissReport(req, res, next) {
  try {
    await reportService.dismissReport(req.params.id, req.user, req.body.resolutionNote);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function actionReport(req, res, next) {
  try {
    await reportService.actionReport(req.params.id, req.user, req.body.action, req.body.resolutionNote);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  listUsers,
  suspendUser,
  reinstateUser,
  getStats,
  listAuditLogs,
  listReports,
  dismissReport,
  actionReport,
};
