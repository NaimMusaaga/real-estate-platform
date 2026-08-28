const userRepository = require('../repositories/user.repository');
const userTokenRepository = require('../repositories/userToken.repository');
const emailService = require('./email.service');
const { comparePassword, hashPassword } = require('../utils/password.util');
const { signToken } = require('../utils/jwt.util');
const { generateToken, hashToken } = require('../utils/token.util');
const { toProfile } = require('../models/user.model');

const EMAIL_VERIFICATION_EXPIRY_HOURS = 24;

class AuthError extends Error {
  constructor(message, status = 401, code = 'UNAUTHORIZED') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function login(email, password) {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new AuthError('Invalid email or password.');
  }

  const passwordMatches = await comparePassword(password, user.password_hash);
  if (!passwordMatches) {
    throw new AuthError('Invalid email or password.');
  }

  if (user.status === 'suspended') {
    throw new AuthError('This account has been suspended.', 403, 'ACCOUNT_SUSPENDED');
  }

  // Email verification is not enforced at login for now (no real mail delivery
  // wired up yet) — the verify-email flow itself (token issuance, /auth/verify-email)
  // stays intact so this gate can be reinstated once outbound email is set up.

  const token = signToken({ sub: user.id, role: user.role });

  return {
    token,
    user: toProfile(user),
  };
}

async function register({ email, password, displayName }) {
  const existing = await userRepository.findByEmail(email);
  if (existing) {
    throw new AuthError('An account with this email already exists.', 409, 'DUPLICATE');
  }

  const passwordHash = await hashPassword(password);
  const userId = await userRepository.create({ email, passwordHash, displayName });

  const rawToken = generateToken();
  const expiresAt = new Date(Date.now() + EMAIL_VERIFICATION_EXPIRY_HOURS * 60 * 60 * 1000);
  await userTokenRepository.create(userId, 'email_verification', hashToken(rawToken), expiresAt);
  await emailService.sendVerificationEmail(email, rawToken);

  return { userId, status: 'pending_verification' };
}

async function verifyEmail(rawToken) {
  const tokenRow = await userTokenRepository.findValid(hashToken(rawToken), 'email_verification');
  if (!tokenRow) {
    throw new AuthError('Invalid or expired verification link.', 400, 'INVALID_TOKEN');
  }

  await userRepository.markEmailVerified(tokenRow.user_id);
  await userTokenRepository.markUsed(tokenRow.id);
}

module.exports = { login, register, verifyEmail, AuthError };
