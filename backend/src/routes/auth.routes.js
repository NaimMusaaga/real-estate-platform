const express = require('express');
const { login, register, verifyEmail } = require('../controllers/auth.controller');
const { validateLogin, validateRegister, validateVerifyEmail } = require('../validators/auth.validator');

const router = express.Router();

router.post('/login', validateLogin, login);
router.post('/register', validateRegister, register);
router.post('/verify-email', validateVerifyEmail, verifyEmail);

module.exports = router;
