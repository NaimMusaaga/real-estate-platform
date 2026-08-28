const authService = require('../services/auth.service');

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}

async function register(req, res, next) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

async function verifyEmail(req, res, next) {
  try {
    await authService.verifyEmail(req.body.token);
    res.status(200).json({ message: 'Email verified successfully.' });
  } catch (err) {
    next(err);
  }
}

module.exports = { login, register, verifyEmail };
