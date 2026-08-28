// Inserts one admin user if it doesn't already exist. See ../../README.md.
const pool = require('../config/db');
const env = require('../config/env');
const { generateId } = require('../utils/uuid.util');
const { hashPassword } = require('../utils/password.util');

async function seedAdmin() {
  const { email, password } = env.admin;

  const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
  if (existing.length > 0) {
    console.log('Admin user already exists:', email);
    process.exit(0);
  }

  const id = generateId();
  const passwordHash = await hashPassword(password);

  await pool.query(
    `INSERT INTO users (id, email, password_hash, display_name, role, status, email_verified_at)
     VALUES (?, ?, ?, ?, 'admin', 'active', NOW())`,
    [id, email, passwordHash, 'Platform Admin']
  );

  console.log('Admin user created:');
  console.log('  email:   ', email);
  console.log('  password:', password);
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Seeding admin failed:', err.message);
  process.exit(1);
});
