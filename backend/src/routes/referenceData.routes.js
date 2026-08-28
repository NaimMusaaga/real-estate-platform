const express = require('express');
const { getGovernorates, getCities } = require('../controllers/referenceData.controller');

const router = express.Router();

router.get('/governorates', getGovernorates);
router.get('/governorates/:governorateId/cities', getCities);

module.exports = router;
