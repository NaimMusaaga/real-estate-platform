const { test, describe, before, after } = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/config/db');
const { uniqueEmail } = require('./helpers');

describe('Listings', () => {
  const password = 'TestPass123!';
  const ownerEmail = uniqueEmail('owner');
  const otherEmail = uniqueEmail('other');
  let ownerToken;
  let otherToken;
  let listingId;

  before(async () => {
    await request(app).post('/api/v1/auth/register').send({ email: ownerEmail, password, displayName: 'Owner' });
    await request(app).post('/api/v1/auth/register').send({ email: otherEmail, password, displayName: 'Other' });
    const ownerLogin = await request(app).post('/api/v1/auth/login').send({ email: ownerEmail, password });
    const otherLogin = await request(app).post('/api/v1/auth/login').send({ email: otherEmail, password });
    ownerToken = ownerLogin.body.token;
    otherToken = otherLogin.body.token;
  });

  test('POST /listings requires auth', async () => {
    const res = await request(app).post('/api/v1/listings').send({});
    assert.equal(res.status, 401);
  });

  test('POST /listings rejects an incomplete payload', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ propertyType: 'residential' });
    assert.equal(res.status, 400);
    assert.equal(res.body.error.code, 'VALIDATION_ERROR');
  });

  test('POST /listings creates a listing for the authenticated owner', async () => {
    const res = await request(app)
      .post('/api/v1/listings')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({
        propertyType: 'land',
        transactionType: 'sale',
        title: 'Automated test listing',
        description: 'Created by the automated test suite.',
        priceUsd: 1000,
        areaSqm: 100,
        governorateId: 1,
        cityId: 1,
        neighborhood: 'Test',
        details: { utilitiesConnected: false, paymentTerms: 'cash' },
      });
    assert.equal(res.status, 201);
    assert.equal(res.body.title, 'Automated test listing');
    assert.deepEqual(res.body.photos, []);
    listingId = res.body.id;
  });

  test('GET /listings/:id returns the listing without auth', async () => {
    const res = await request(app).get(`/api/v1/listings/${listingId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.title, 'Automated test listing');
  });

  test('PATCH /listings/:id is forbidden for a non-owner', async () => {
    const res = await request(app)
      .patch(`/api/v1/listings/${listingId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'hacked' });
    assert.equal(res.status, 403);
    assert.equal(res.body.error.code, 'FORBIDDEN');
  });

  test('DELETE /listings/:id is forbidden for a non-owner', async () => {
    const res = await request(app)
      .delete(`/api/v1/listings/${listingId}`)
      .set('Authorization', `Bearer ${otherToken}`);
    assert.equal(res.status, 403);
  });

  test('DELETE /listings/:id succeeds for the owner', async () => {
    const res = await request(app)
      .delete(`/api/v1/listings/${listingId}`)
      .set('Authorization', `Bearer ${ownerToken}`);
    assert.equal(res.status, 204);
    listingId = null;
  });

  after(async () => {
    if (listingId) await pool.query('DELETE FROM listings WHERE id = ?', [listingId]);
    await pool.query('DELETE FROM users WHERE email IN (?, ?)', [ownerEmail, otherEmail]);
    await pool.end();
  });
});
