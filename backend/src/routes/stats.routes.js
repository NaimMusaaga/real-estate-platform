const express = require('express');
const controller = require('../controllers/stats.controller');

const router = express.Router();

router.get('/public', controller.getPublicStats);

module.exports = router;
