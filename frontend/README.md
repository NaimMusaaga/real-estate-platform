# Frontend — Real Estate Platform (MVP)

React 18 + TypeScript + Vite + Tailwind CSS v4, Arabic-only / RTL (`lang="ar" dir="rtl"`).

## Setup

1. `npm install`
2. Copy `.env.example` to `.env`.
3. `npm run dev` (expects the backend running locally per `../backend/README.md`)

## Pages

| Route | Page | Notes |
|---|---|---|
| `/login`, `/register`, `/verify-email` | Auth | Registration logs the user in immediately (see backend README — email verification isn't enforced yet) |
| `/` | Public search | Governorate/city/property-type filters, no login required |
| `/listings/:id` | Listing detail | Photo gallery, full details, chat-inquiry button, report button (hidden from the owner) |
| `/dashboard` | Dashboard | Personal stats + quick links |
| `/create-listing` | Create listing | 5-step wizard (type → location → details → price → review), branches per property type |
| `/my-listings` | My listings | Status toggle, delete, and an optional photo manager per listing |
| `/profile` | Profile | Details + password, as two independent forms |
| `/conversations`, `/conversations/:id` | Chat | Real-time via Socket.IO — see `context/SocketContext.tsx` |
| `/admin/dashboard` | Admin overview | Platform stats + recent admin-action feed |
| `/admin/users` | Admin users | Suspend (reason required) / reinstate, audit-logged |
| `/admin/reports` | Admin reports | Pending report queue — dismiss, archive the listing, or remove it permanently |

Admin routes are gated by `routes/AdminRoute.tsx` (role check, not just login check).

## State

- `context/AuthContext.tsx` — session, exposes `user`/`login`/`logout`/`setUser`.
- `context/SocketContext.tsx` — one Socket.IO connection per session, plus a live `presenceMap` shared by any component that needs it.
- No global state library — `useState`/`useEffect` per page was sufficient at this scope.

## Conventions

- Every page/component is typed end to end (no `any`); API response shapes live in `types/*.types.ts` and mirror the backend's camelCase JSON.
- Shared UI primitives (`Button`, `Input`, `Card`, `Alert`, `Modal`, `ConfirmDialog`, `Spinner`) live in `components/common/` and are reused everywhere rather than styled ad hoc per page.
- RTL uses logical CSS properties (`ms-`, `border-e`, etc.) over physical ones (`ml-`, `border-l`) so layout mirrors correctly.
