const userRepository = require('../repositories/user.repository');
const userService = require('../services/user.service');
const statsService = require('../services/stats.service');
const { toProfile } = require('../models/user.model');

async function getMe(req, res, next) {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: { code: 'NOT_FOUND', message: 'User not found.' } });
    }

    res.status(200).json(toProfile(user));
  } catch (err) {
    next(err);
  }
}

async function updateMe(req, res, next) {
  try {
    const profile = await userService.updateProfile(req.user.id, req.body);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}

async function changePassword(req, res, next) {
  try {
    await userService.changePassword(req.user.id, req.body.currentPassword, req.body.newPassword);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function blockUser(req, res, next) {
  try {
    await userService.blockUser(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function unblockUser(req, res, next) {
  try {
    await userService.unblockUser(req.user.id, req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function getBlockStatus(req, res, next) {
  try {
    const status = await userService.getBlockStatus(req.user.id, req.params.id);
    res.status(200).json(status);
  } catch (err) {
    next(err);
  }
}

async function getMyStats(req, res, next) {
  try {
    const stats = await statsService.getMyStats(req.user.id);
    res.status(200).json(stats);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMe, updateMe, changePassword, blockUser, unblockUser, getBlockStatus, getMyStats };
