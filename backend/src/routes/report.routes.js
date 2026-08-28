const express = require('express');
const controller = require('../controllers/report.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validateCreateReport } = require('../validators/report.validator');

const router = express.Router();

router.post('/', requireAuth, validateCreateReport, controller.create);

module.exports = router;
