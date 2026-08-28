const userRepository = require('../repositories/user.repository');
const adminAuditLogRepository = require('../repositories/adminAuditLog.repository');
const userBlockRepository = require('../repositories/userBlock.repository');
const { hashPassword, comparePassword } = require('../utils/password.util');
const AppError = require('../utils/AppError');
const { toProfile, toAdminSummary } = require('../models/user.model');
const { toAuditLogEntry } = require('../models/adminAuditLog.model');

async function updateProfile(userId, input) {
  await userRepository.updateProfile(userId, input);
  const user = await userRepository.findById(userId);
  return toProfile(user);
}

async function changePassword(userId, currentPassword, newPassword) {
  const user = await userRepository.findById(userId);
  const matches = await comparePassword(currentPassword, user.password_hash);
  if (!matches) {
    throw new AppError('Current password is incorrect.', 400, 'VALIDATION_ERROR');
  }
  const newHash = await hashPassword(newPassword);
  await userRepository.updatePasswordHash(userId, newHash);
}

async function listUsers() {
  const rows = await userRepository.listAll();
  return rows.map(toAdminSummary);
}

async function suspendUser(targetUserId, admin, reason) {
  if (targetUserId === admin.id) {
    throw new AppError('You cannot suspend your own account.', 400, 'VALIDATION_ERROR');
  }
  const target = await userRepository.findById(targetUserId);
  if (!target) {
    throw new AppError('User not found.', 404, 'NOT_FOUND');
  }
  await userRepository.updateStatus(targetUserId, 'suspended');
  await adminAuditLogRepository.create(admin.id, 'suspend_user', 'users', targetUserId, reason);
}

async function reinstateUser(targetUserId, admin) {
  const target = await userRepository.findById(targetUserId);
  if (!target) {
    throw new AppError('User not found.', 404, 'NOT_FOUND');
  }
  await userRepository.updateStatus(targetUserId, 'active');
  await adminAuditLogRepository.create(admin.id, 'reinstate_user', 'users', targetUserId, null);
}

async function blockUser(blockerId, blockedId) {
  if (blockerId === blockedId) {
    throw new AppError('You cannot block yourself.', 400, 'VALIDATION_ERROR');
  }
  const target = await userRepository.findById(blockedId);
  if (!target) {
    throw new AppError('User not found.', 404, 'NOT_FOUND');
  }
  await userBlockRepository.block(blockerId, blockedId);
}

async function unblockUser(blockerId, blockedId) {
  await userBlockRepository.unblock(blockerId, blockedId);
}

async function getBlockStatus(currentUserId, otherUserId) {
  const [blockedByMe, blockedByOther] = await Promise.all([
    userBlockRepository.hasBlocked(currentUserId, otherUserId),
    userBlockRepository.hasBlocked(otherUserId, currentUserId),
  ]);
  return { blockedByMe, blockedByOther };
}

async function listAuditLogs() {
  const rows = await adminAuditLogRepository.listRecent(100);
  return rows.map(toAuditLogEntry);
}

module.exports = {
  updateProfile,
  changePassword,
  listUsers,
  suspendUser,
  reinstateUser,
  blockUser,
  unblockUser,
  getBlockStatus,
  listAuditLogs,
};
