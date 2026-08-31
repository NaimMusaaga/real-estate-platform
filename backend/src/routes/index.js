const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const listingRoutes = require('./listing.routes');
const referenceDataRoutes = require('./referenceData.routes');
const adminRoutes = require('./admin.routes');
const conversationRoutes = require('./conversation.routes');
const reportRoutes = require('./report.routes');
const statsRoutes = require('./stats.routes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/listings', listingRoutes);
router.use('/', referenceDataRoutes);
router.use('/admin', adminRoutes);
router.use('/conversations', conversationRoutes);
router.use('/reports', reportRoutes);
router.use('/stats', statsRoutes);

module.exports = router;
