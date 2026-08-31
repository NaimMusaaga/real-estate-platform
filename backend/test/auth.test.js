const { test, describe, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');
const { uniqueEmail } = require('./helpers');

describe('Auth', () => {
  const email = uniqueEmail('auth');
  const password = 'TestPass123!';
  let userId;

  test('POST /auth/register creates a pending user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, displayName: 'Test User' });
    assert.equal(res.status, 201);
    assert.ok(res.body.userId);
    userId = res.body.userId;
  });

  test('POST /auth/register rejects a duplicate email', async () => {
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({ email, password, displayName: 'Test User' });
    assert.equal(res.status, 409);
    assert.equal(res.body.error.code, 'DUPLICATE');
  });

  test('POST /auth/login succeeds right after registration (no email-verification gate today)', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email, password });
    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, email);
    assert.equal(res.body.user.role, 'user');
  });

  test('POST /auth/login rejects a wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email, password: 'WrongPass!' });
    assert.equal(res.status, 401);
    assert.equal(res.body.error.code, 'UNAUTHORIZED');
  });

  test('POST /auth/login rejects an unknown email', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: uniqueEmail('nope'), password });
    assert.equal(res.status, 401);
  });

  after(async () => {
    if (userId) await pool.query('DELETE FROM users WHERE id = ?', [userId]);
    await pool.end();
  });
});
