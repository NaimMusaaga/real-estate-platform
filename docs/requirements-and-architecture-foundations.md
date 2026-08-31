# Syrian Real Estate Platform — Requirements & Architecture Foundations

**Phase:** Analysis & Design (Database design now follows in a companion document)
**Status:** v2 — all 11 open questions from v1 resolved and integrated. Changes from v1 are marked **(v2)**.

---

## 1. Decisions Confirmed So Far

| Topic | Decision |
|---|---|
| Currency (SYP/USD) | Lister manually enters **both** a SYP price and a USD price — displayed exactly as entered, never auto-converted. **(v2)** A static, admin-editable reference exchange rate is used *only in the background* to widen search filtering across both currencies — see FR-SF-4. |
| Address hierarchy | **Governorate** and **City/Region** are fixed, admin-maintained dropdowns; **Neighborhood** and **Detailed Address** are free text |
| Listing moderation | Listings **auto-publish immediately**; moderation is reactive (reports + admin spot checks) |
| Monetization | Platform is **completely free** in v1 — no payments, subscriptions, or boosted listings |
| Registration | **Email + password**, with **mandatory email verification** before listing or chatting **(v2 — confirmed)** |
| Who can list | **Any registered user** can create listings directly |
| Chat scope | 1:1 chat, always tied to a specific property inquiry. **(v2)** Online presence + read receipts are **in scope**. Image/file sharing remains **out of scope**. |
| Chat safety | **(v2 — new)** Users can block another user (simple boolean block) to stop unwanted contact. |
| Property categories | Residential For Sale, Residential For Rent, Commercial, Land/Plots |
| Notifications | In-app only (notification center) — no push, email, or SMS |
| Listing lifecycle | Listings stay live indefinitely; admins have a manual tool to archive inactive ones. **(v2 — new)** A soft daily cap (5 listings/day/user) flags — but does not block — an account for admin review. |
| Listing media | Photos only, capped at roughly 10–15 per listing; no video |
| Favorites | **(v2 — new)** Users can save/favorite listings for later. |
| Language | **(v2 — confirmed)** Arabic-only, RTL. No multi-language/i18n data model needed. |
| Admin chat visibility | **(v2 — new)** Admins see conversation **metadata only** (participants, message count, timestamps) by default. Full message content is visible only for a conversation that has been explicitly reported. |
| Target scale | MVP scale — hundreds of users, low concurrency, with a documented growth path |

---

## 2. User Roles & Permissions

Unchanged from v1: **Guest**, **Registered User** (Seeker and Lister are behavioral modes of the same account, not separate roles), and **Admin**. See v1 for the full permission matrix — no changes triggered by your v2 answers.

---

## 3. Functional Requirements

### 3.1 User Management

| ID | Requirement |
|---|---|
| FR-UM-1 | A visitor can register with an email address and password. |
| FR-UM-2 | Email verification (via emailed link) is **mandatory** before the account can create listings or send chat messages. |
| FR-UM-3 | A registered user can log in and log out. |
| FR-UM-4 | A registered user can reset a forgotten password via an emailed reset link. |
| FR-UM-5 | A registered user can view and edit their own profile (display name, phone number for contact display, profile photo). |
| FR-UM-6 | A registered user can view a read-only public profile of another user (display name, photo, member-since date, their active listings). |
| FR-UM-7 | An Admin can view all user accounts, suspend a user, or reinstate a suspended user. |
| FR-UM-8 | A suspended user cannot log in, create listings, or send chat messages; their listings are hidden from search while suspended. |
| FR-UM-9 **(v2)** | An account is automatically flagged for admin review when it exceeds the soft daily listing cap (see FR-PL-17). Flagging does not block the account from any action. |

### 3.2 Property Listings

#### 3.2.1 Address Hierarchy (text-based, no maps) — unchanged

```
Governorate (fixed list, admin-managed)
   -> City / Region (fixed list per governorate, admin-managed)
      -> Neighborhood (free text)
         -> Detailed Address (free text — street, building, floor, landmark)
```

#### 3.2.2 Core Listing Fields

| ID | Requirement |
|---|---|
| FR-PL-6 | A listing has: Title, Description, Property Type, Transaction Type, Price in SYP, Price in USD, Area (m²), Address. |
| FR-PL-7 **(v2 — finalized)** | For **Residential**: bedrooms, bathrooms, floor number, total floors, furnishing status (Furnished/Unfurnished/Semi-furnished), building year, **Cladding/Finishing condition** (حالة الإكساء: Unfinished / Semi-Finished / Fully Finished), **Payment Terms** (طريقة الدفع: Cash / Installments / Both). |
| FR-PL-8 | For **Commercial**: commercial sub-type (shop/office/warehouse/other), floor number, frontage/street access notes. |
| FR-PL-9 | For **Land/Plots**: land area, zoning/usage notes, whether utilities (water/electricity) are connected. |
| FR-PL-10 **(v2 — finalized list)** | Amenity tags: Parking, Elevator, **Solar Panels / Backup Generator** (طاقة شمسية / مولدة), **Water Well / Extra Water Tank** (بئر ماء / خزان إضافي), Balcony, Garden, Air Conditioning, Security. |
| FR-PL-11 | Up to ~10–15 photos per listing, drag-to-reorder, one designated cover photo. |
| FR-PL-12 | Listing status: **Active**, **Sold/Rented**, **Archived**. |
| FR-PL-13 | Owner can edit any field of their own listing at any time; no re-moderation required. |
| FR-PL-14 | Owner can permanently delete their own listing. |
| FR-PL-15 | Any registered user can report a listing. Reports go into the Admin queue. |
| FR-PL-16 | An Admin can archive or permanently remove any listing, with a required, audit-logged reason. |
| FR-PL-17 **(v2 — new)** | Soft cap: if a user creates more than 5 listings within a rolling 24-hour window, the 6th+ listings are still created and published normally, but the account is flagged (FR-UM-9) for admin review. Not a hard block. |

### 3.3 Search & Filters

| ID | Requirement |
|---|---|
| FR-SF-1 | Keyword search over Title/Description, available to Guests. |
| FR-SF-2 | Filter by Governorate and City. |
| FR-SF-3 | Filter by Property Type and Transaction Type. |
| FR-SF-4 **(v2 — hybrid currency filtering)** | Filter by price range in either SYP or USD. Displayed prices are always exactly what the lister entered (never converted). For *filtering only*, the system also applies a static, admin-editable reference exchange rate so that, e.g., a user filtering "$50,000–$80,000" also catches SYP-only listings whose SYP price converts into that range at the current reference rate. A listing that has both prices entered is matched directly on whichever currency the user filtered in; a listing with only one currency is matched using the converted estimate for the other. |
| FR-SF-5 | Filter by area range, and for residential, minimum bedrooms/bathrooms. |
| FR-SF-6 | Filter by amenities (finalized list per FR-PL-10). |
| FR-SF-7 | Sort by newest first, price ascending, price descending. |
| FR-SF-8 | Paginated results. |
| FR-SF-9 | Archived, Sold/Rented, and suspended-user listings excluded from default search. |

### 3.4 Real-Time Chat

| ID | Requirement |
|---|---|
| FR-CH-1 | Seeker starts a chat from a listing's "Contact about this property" action. |
| FR-CH-2 | Each conversation is scoped to one (listing, seeker, owner) triple. |
| FR-CH-3 | Messages delivered in real time over WebSockets while both parties are online. |
| FR-CH-4 | Messages sent while the recipient is offline persist and are shown on their next visit. |
| FR-CH-5 | A user can view a list of all their conversations with last-message preview. |
| FR-CH-6 | Message history persists and is retrievable on scroll-back. |
| FR-CH-7 | A user can report the other party or the conversation itself (feeds the Admin report queue). |
| FR-CH-8 | If a referenced listing is archived/deleted, the conversation stays readable, marked as referencing an inactive listing. |
| FR-CH-9 **(v2 — new)** | The system shows whether the other participant is currently online, and a "last seen" timestamp when they are not. |
| FR-CH-10 **(v2 — new)** | Each message shows a delivered/read state to its sender (double-check-style read receipt), updated in real time when the recipient views it. |
| FR-CH-11 **(v2 — new)** | A user can block another user. Once blocked: the blocked user cannot send new messages in any shared conversation or start a new one; existing message history remains visible to both; the blocker can unblock at any time. |

*(Image/file sharing in chat remains explicitly out of scope for v1.)*

### 3.5 Notifications — unchanged from v1

| ID | Requirement |
|---|---|
| FR-NT-1 | New chat message → in-app notification. |
| FR-NT-2 | Listing archived/removed by Admin → notification to owner with reason. |
| FR-NT-3 | Filed report resolved → notification to reporter. |
| FR-NT-4 | Notification center shows unread count, marks read on view. |
| FR-NT-5 | Real-time delivery over the same WebSocket channel as chat when the user is connected. |

### 3.6 Favorites **(v2 — new module)**

| ID | Requirement |
|---|---|
| FR-FAV-1 | A registered user can save/unsave any Active listing to a personal Favorites list. |
| FR-FAV-2 | A user can view their full Favorites list, with the same summary card used in search results. |
| FR-FAV-3 | If a favorited listing is later archived, removed, or marked Sold/Rented, it remains in the Favorites list but is visually marked with its current status rather than silently disappearing. |

---

## 4. Non-Functional Requirements

### 4.1 Performance — unchanged
- NFR-PERF-1: Search/filter p95 < 500ms at MVP volume.
- NFR-PERF-2: Chat message delivery to an online recipient < 1s end-to-end.
- NFR-PERF-3: Server-side photo compression/resizing on upload.
- NFR-PERF-4 **(v2 — new)**: Presence and read-receipt updates propagate to the other participant in under 1s, same budget as message delivery, since they ride the same WebSocket channel.

### 4.2 Security
- NFR-SEC-1 to NFR-SEC-7: unchanged from v1 (password hashing, TLS, per-conversation access control, per-owner listing access control, upload validation, rate limiting, admin audit logging).
- NFR-SEC-8 **(v2 — new)**: By default, an Admin's view of a conversation is limited to metadata (participant identities, message count, first/last message timestamps). Full message content is only unlocked for a conversation once a report has been filed against it by one of its participants (FR-CH-7), and that access is itself audit-logged (NFR-SEC-7).
- NFR-SEC-9 **(v2 — new)**: A blocked user's attempt to message is rejected server-side (not just hidden client-side), consistent with NFR-SEC-4's "authorization enforced server-side" principle.

### 4.3 Scalability (WebSockets)
- NFR-SCALE-1 to NFR-SCALE-3: unchanged (single instance sufficient at MVP scale; abstraction layer allows adding a pub/sub backplane later; DB indexes chosen for search).
- NFR-SCALE-4 **(v2 — new)**: "Online now" presence state is inherently ephemeral (tied to an active WebSocket connection) and should live in application memory (or, once horizontally scaled, a shared store like Redis) rather than being written to the relational database on every heartbeat. Only the durable **last-seen timestamp** is persisted to the database, on disconnect — see the `users.last_seen_at` column in the Database Design document.

### 4.4 Availability — unchanged
- NFR-AVAIL-1: 99% MVP uptime target.
- NFR-AVAIL-2: Auto-reconnect with backoff on WebSocket drop; no message loss.
- NFR-AVAIL-3: Regular automated backups.

---

## 5. Detailed Use Cases

Use cases UC-1 (Register), UC-2 (Create Listing), UC-3 (Search), UC-5 (Report/Moderate) are unchanged from v1 except where noted. UC-4 is updated for presence/read receipts and blocking:

### UC-4: Real-Time Chat Inquiry About a Property **(v2 — updated)**

- **Actor**: Registered User (Seeker) and Registered User (Owner)
- **Goal**: Seeker asks the owner questions about a specific listing in real time
- **Preconditions**: Both users logged in and verified; Seeker viewing an Active listing that isn't their own; neither has blocked the other
- **Main Flow**:
  1. Seeker clicks "Contact about this property."
  2. System finds/creates the conversation scoped to (listing, seeker, owner).
  3. Seeker's chat header shows whether Owner is currently online, or their last-seen time if not.
  4. Seeker sends a message; if Owner is online it's delivered over WebSocket in real time and marked "delivered."
  5. When Owner opens/views the conversation, the message is marked "read," and Seeker's UI updates in real time to reflect that.
  6. Owner replies; same delivery/read flow applies in reverse.
  7. Conversation history persists for both parties.
- **Alternate/Error Flows**:
  - **A1 — Owner offline**: Message persists, delivered/marked-read on Owner's next visit (FR-CH-4); presence shows "last seen" instead of "online."
  - **A2 — Seeker views own listing**: "Contact" action is hidden/disabled.
  - **A3 — WebSocket drop mid-conversation**: Auto-reconnect (NFR-AVAIL-2); delivery acknowledgment tells the sender if a message needs resending.
  - **A4 — Listing archived/deleted mid-conversation**: Conversation stays accessible, marked inactive-listing (FR-CH-8); messaging can continue.
  - **A5 — (v2, new) Owner has blocked Seeker, or vice versa**: "Contact about this property" is disabled for the blocked party against that specific user; if a block occurs mid-conversation, the blocked party's input is disabled going forward but existing history remains visible to both (FR-CH-11).

---

## 6. Assumptions Made (v2)

Carried-forward v1 assumptions are now confirmed decisions (see §1) and removed from this list. New assumptions surfaced while finalizing v2 and drafting the database design:

1. **Finishing condition has three levels**, not two: I added "Semi-Finished" between your two named examples (Unfinished/Fully Finished) because it's a real, commonly-listed middle state in the Syrian market (structure done, no final flooring/paint/fixtures). Flag if you want a strict two-value field instead.
2. **Payment Terms (Cash/Installments/Both) is modeled on Residential listings only**, per the literal scope of your answer. It isn't yet added to Commercial or Land listings — flagged as an open question below, since installment sales are also common for land/commercial in practice.
3. **The reference exchange rate (FR-SF-4) is a single current value**, not a rate history — the database design keeps a lightweight append-only history for audit purposes, but only the latest row is ever used for live filtering.
4. **PostgreSQL** is assumed as the database engine for the design that follows (native enum types, GIN/trigram indexes for Arabic keyword search, JSONB where useful, mature WebSocket-adjacent ecosystem). Flagged as an open question below since you haven't specified a stack yet.
5. **UUID primary keys** for user-facing, potentially-enumerable entities (users, listings, conversations, messages, reports) to avoid exposing sequential IDs/counts; **small integer keys** for low-cardinality admin-managed reference tables (governorates, cities, amenities) where enumeration isn't a concern and integer FKs keep join columns compact.

## 7. Open Questions Remaining

1. **Payment Terms scope**: Should "Cash / Installments / Both" also apply to Commercial and Land listings, or is it intentionally residential-only?
2. **Database engine**: Confirm PostgreSQL, or do you have an existing stack preference (e.g., MySQL) I should design against instead?
3. **Finishing condition granularity**: Comfortable with the three-level scale I added (Unfinished / Semi-Finished / Fully Finished), or do you want to keep it strictly to your original two?
4. **Presence threshold**: Is "online" simply "has an active WebSocket connection right now," or do you want a short grace window (e.g., still shown "online" for 30–60s after a tab is backgrounded) to avoid presence flickering on flaky mobile connections?

---

*Database Design phase follows in a companion document, built directly on this v2's entities: Users, Governorates/Cities, Listings (+ type-specific detail tables), Amenities, Photos, Favorites, Conversations, Messages, Blocks, Reports, Notifications, Exchange Rate history, and Admin Audit Log.*
