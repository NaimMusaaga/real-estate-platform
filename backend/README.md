# Backend — Real Estate Platform (MVP)

Node.js + Express + Socket.IO + MySQL/MariaDB. Local development only for now (see [system-architecture.md](../docs/system-architecture.md) for the zero-cost deployment plan).

## Setup

1. `npm install`
2. Copy `.env.example` to `.env` and fill in your local MySQL credentials (XAMPP defaults work out of the box: `root`, no password, port 3306).
3. Create an empty database (e.g. `real_estate`) via phpMyAdmin or the `mysql` CLI.
4. `npm run migrate` — creates all tables from `src/database/schema.sql`.
5. `npm run seed:admin` — creates the first admin user (credentials from `.env`, default `admin@example.com` / `Admin123!`).
6. `npm run seed:reference` — seeds a small governorates/cities dataset (5 governorates, 2 cities each) so listing forms have real dropdown data. Not the full 14-governorate dataset — that's a data-entry task, not a code one.
7. `npm run dev`

## What's implemented

- **Auth**: registration + login (single JWT, 1-day expiry — no refresh token by design), protected routes. Email verification is not currently enforced at login (no outbound mail server wired up yet) — the verify-link flow itself still works end to end and can be reinstated once real email delivery (`EMAIL_MODE=mailtrap`) is configured.
- **Users**: profile + password self-service, admin suspend/reinstate with audit logging, block/unblock between users.
- **Listings**: full CRUD across residential/commercial/land types (each with its own detail table), dual SYP/USD pricing, payment terms, public search/browse with filters, optional photo uploads (multer, local disk storage, JPEG/PNG/WEBP, up to 8 per listing).
- **Real-time chat**: Socket.IO rooms per conversation, messaging, delivery + read receipts, online/last-seen presence, per-user rate limiting, block enforcement.
- **Moderation**: users can report a listing (fraudulent/duplicate/inappropriate/etc.); admins review the report queue and dismiss, archive, or permanently remove the listing — every archive/remove action an admin takes on someone else's listing is written to the admin audit log automatically.
- **Stats**: personal counts (`/users/me/stats`), an admin-wide overview (`/admin/stats`), and a public summary (`/stats/public` — active listings + active users, no auth required, used by the homepage stats banner).

## Testing

```bash
npm test
```

`node:test` + `supertest`, run against the real Express app and a real database — no mocks, matching how this backend has been tested throughout. Each test file cleans up the rows it creates.

## Explicitly not implemented (deferred, not forgotten)

Favorites/saved listings, in-app notifications (the `notifications` table exists in the schema but nothing writes to it yet), exchange-rate-based currency search, forgot-password flow, real outbound email delivery. Reporting a user or a conversation is also schema-ready (the `reports` table is polymorphic) but only the listing-report path has an API today.

## Architecture

`routes` → `controllers` → `services` → `repositories` → `models`, with `sockets/` holding the Socket.IO side of the same layering (`socketAuth.middleware.js`, `handlers/`, `presence.js`, `rateLimiter.js`).
