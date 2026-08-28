const express = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const { adminOnly } = require('../middlewares/adminOnly.middleware');
const { validateSuspend } = require('../validators/user.validator');
const { validateReportAction } = require('../validators/report.validator');
const controller = require('../controllers/admin.controller');

const router = express.Router();

router.use(requireAuth, adminOnly);

router.get('/stats', controller.getStats);
router.get('/users', controller.listUsers);
router.patch('/users/:id/suspend', validateSuspend, controller.suspendUser);
router.patch('/users/:id/reinstate', controller.reinstateUser);
router.get('/audit-logs', controller.listAuditLogs);
router.get('/reports', controller.listReports);
router.patch('/reports/:id/dismiss', controller.dismissReport);
router.patch('/reports/:id/action', validateReportAction, controller.actionReport);

module.exports = router;
