const express = require('express');
const { requireAuth } = require('../middlewares/auth.middleware');
const { validateStartConversation } = require('../validators/conversation.validator');
const controller = require('../controllers/conversation.controller');

const router = express.Router();

router.use(requireAuth);
router.get('/', controller.listConversations);
router.post('/', validateStartConversation, controller.startConversation);
router.get('/:id/messages', controller.getMessages);

module.exports = router;
