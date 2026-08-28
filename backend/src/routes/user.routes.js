const express = require('express');
const {
  getMe,
  updateMe,
  changePassword,
  blockUser,
  unblockUser,
  getBlockStatus,
  getMyStats,
} = require('../controllers/user.controller');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validateUpdateProfile, validateChangePassword } = require('../validators/user.validator');

const router = express.Router();

router.get('/me', requireAuth, getMe);
router.get('/me/stats', requireAuth, getMyStats);
router.patch('/me', requireAuth, validateUpdateProfile, updateMe);
router.patch('/me/password', requireAuth, validateChangePassword, changePassword);
router.get('/:id/block-status', requireAuth, getBlockStatus);
router.post('/:id/block', requireAuth, blockUser);
router.delete('/:id/block', requireAuth, unblockUser);

module.exports = router;
