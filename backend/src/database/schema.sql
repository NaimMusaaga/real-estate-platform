-- Real Estate Platform — MariaDB 10.4 schema (XAMPP's bundled server; see database-design.md v4)
-- Run once against an already-created database (see backend/README.md).

CREATE TABLE governorates (
    id          SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name_ar     VARCHAR(100) NOT NULL,
    sort_order  SMALLINT NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE cities (
    id              INT UNSIGNED NOT NULL AUTO_INCREMENT,
    governorate_id  SMALLINT UNSIGNED NOT NULL,
    name_ar         VARCHAR(100) NOT NULL,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    CONSTRAINT fk_cities_governorate FOREIGN KEY (governorate_id) REFERENCES governorates(id),
    UNIQUE KEY uq_cities_gov_name (governorate_id, name_ar)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_cities_governorate ON cities(governorate_id);

CREATE TABLE amenities (
    id        SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    name_ar   VARCHAR(100) NOT NULL,
    slug      VARCHAR(50) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (id),
    UNIQUE KEY uq_amenities_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


CREATE TABLE users (
    id                   CHAR(36) NOT NULL,
    email                VARCHAR(255) NOT NULL,
    password_hash        VARCHAR(255) NOT NULL,
    display_name         VARCHAR(100) NOT NULL,
    phone                VARCHAR(20),
    profile_photo_url    VARCHAR(500),
    email_verified_at    DATETIME,
    role                 ENUM('user','admin') NOT NULL DEFAULT 'user',
    status               ENUM('active','suspended') NOT NULL DEFAULT 'active',
    listing_flag_status  ENUM('normal','flagged_for_review') NOT NULL DEFAULT 'normal',
    last_seen_at         DATETIME,
    created_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_users_flagged ON users(listing_flag_status);

CREATE TABLE user_tokens (
    id          CHAR(36) NOT NULL,
    user_id     CHAR(36) NOT NULL,
    token_type  ENUM('email_verification','password_reset') NOT NULL,
    token_hash  VARCHAR(255) NOT NULL,
    expires_at  DATETIME NOT NULL,
    used_at     DATETIME,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_user_tokens_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY uq_user_tokens_hash (token_hash)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_user_tokens_user ON user_tokens(user_id, token_type);


CREATE TABLE listings (
    id               CHAR(36) NOT NULL,
    owner_id         CHAR(36) NOT NULL,
    property_type    ENUM('residential','commercial','land') NOT NULL,
    transaction_type ENUM('sale','rent') NOT NULL,
    title            VARCHAR(150) NOT NULL,
    description      TEXT NOT NULL,
    price_syp        DECIMAL(14,2),
    price_usd        DECIMAL(12,2),
    area_sqm         DECIMAL(10,2) NOT NULL,
    governorate_id   SMALLINT UNSIGNED NOT NULL,
    city_id          INT UNSIGNED NOT NULL,
    neighborhood     VARCHAR(150) NOT NULL,
    address_detail   TEXT,
    status           ENUM('active','sold_rented','archived') NOT NULL DEFAULT 'active',
    created_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_listings_owner FOREIGN KEY (owner_id) REFERENCES users(id),
    CONSTRAINT fk_listings_governorate FOREIGN KEY (governorate_id) REFERENCES governorates(id),
    CONSTRAINT fk_listings_city FOREIGN KEY (city_id) REFERENCES cities(id),
    CONSTRAINT chk_listing_has_a_price CHECK (price_syp IS NOT NULL OR price_usd IS NOT NULL)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE INDEX idx_listings_search ON listings(status, governorate_id, city_id, property_type, transaction_type);
CREATE INDEX idx_listings_price_usd ON listings(status, price_usd);
CREATE INDEX idx_listings_price_syp ON listings(status, price_syp);
CREATE INDEX idx_listings_owner_created ON listings(owner_id, created_at);
-- No FULLTEXT index: MariaDB (what XAMPP actually ships) has no `ngram` parser plugin,
-- and a plain FULLTEXT's stemming/stopword rules are English-oriented anyway.
-- Keyword search (FR-SF-1) is a plain LIKE '%term%' query in listing.repository.js —
-- entirely adequate at MVP scale; revisit only if search quality is a real complaint later.


CREATE TABLE listing_residential_details (
    listing_id           CHAR(36) NOT NULL,
    bedrooms             SMALLINT NOT NULL,
    bathrooms            SMALLINT NOT NULL,
    floor_number         SMALLINT,
    total_floors         SMALLINT,
    furnishing_status    ENUM('furnished','unfurnished','semi_furnished') NOT NULL,
    building_year        SMALLINT,
    finishing_condition  ENUM('unfinished','semi_finished','fully_finished') NOT NULL,
    payment_terms        ENUM('cash','installments','both') NOT NULL DEFAULT 'cash',
    PRIMARY KEY (listing_id),
    CONSTRAINT fk_res_details_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE listing_commercial_details (
    listing_id          CHAR(36) NOT NULL,
    commercial_subtype  ENUM('shop','office','warehouse','other') NOT NULL,
    floor_number        SMALLINT,
    frontage_notes       TEXT,
    payment_terms        ENUM('cash','installments','both') NOT NULL DEFAULT 'cash',
    PRIMARY KEY (listing_id),
    CONSTRAINT fk_com_details_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE listing_land_details (
    listing_id           CHAR(36) NOT NULL,
    zoning_notes         TEXT,
    utilities_connected  BOOLEAN NOT NULL DEFAULT FALSE,
    payment_terms        ENUM('cash','installments','both') NOT NULL DEFAULT 'cash',
    PRIMARY KEY (listing_id),
    CONSTRAINT fk_land_details_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE listing_photos (
    id          CHAR(36) NOT NULL,
    listing_id  CHAR(36) NOT NULL,
    url         VARCHAR(500) NOT NULL,
    sort_order  SMALLINT NOT NULL DEFAULT 0,
    is_cover    BOOLEAN NOT NULL DEFAULT FALSE,
    cover_slot  CHAR(36) GENERATED ALWAYS AS (CASE WHEN is_cover THEN listing_id END) STORED,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_listing_photos_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    UNIQUE KEY uq_listing_photos_one_cover (cover_slot)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_listing_photos_order ON listing_photos(listing_id, sort_order);

CREATE TABLE listing_amenities (
    listing_id  CHAR(36) NOT NULL,
    amenity_id  SMALLINT UNSIGNED NOT NULL,
    PRIMARY KEY (listing_id, amenity_id),
    CONSTRAINT fk_listing_amenities_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE,
    CONSTRAINT fk_listing_amenities_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_listing_amenities_reverse ON listing_amenities(amenity_id);

CREATE TABLE favorites (
    user_id     CHAR(36) NOT NULL,
    listing_id  CHAR(36) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, listing_id),
    CONSTRAINT fk_favorites_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_favorites_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_favorites_listing ON favorites(listing_id);


CREATE TABLE conversations (
    id                     CHAR(36) NOT NULL,
    listing_id             CHAR(36),
    listing_title_snapshot VARCHAR(150),
    seeker_id              CHAR(36) NOT NULL,
    owner_id               CHAR(36) NOT NULL,
    created_at             DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_conversations_listing FOREIGN KEY (listing_id) REFERENCES listings(id) ON DELETE SET NULL,
    CONSTRAINT fk_conversations_seeker FOREIGN KEY (seeker_id) REFERENCES users(id),
    CONSTRAINT fk_conversations_owner FOREIGN KEY (owner_id) REFERENCES users(id),
    CONSTRAINT chk_seeker_not_owner CHECK (seeker_id <> owner_id),
    UNIQUE KEY uq_conversations_thread (listing_id, seeker_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_conversations_seeker ON conversations(seeker_id);
CREATE INDEX idx_conversations_owner ON conversations(owner_id);

CREATE TABLE messages (
    id               CHAR(36) NOT NULL,
    conversation_id  CHAR(36) NOT NULL,
    sender_id        CHAR(36) NOT NULL,
    body             TEXT NOT NULL,
    sent_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delivered_at     DATETIME,
    read_at          DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_messages_conversation_history ON messages(conversation_id, sent_at);

CREATE TABLE user_blocks (
    blocker_id  CHAR(36) NOT NULL,
    blocked_id  CHAR(36) NOT NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (blocker_id, blocked_id),
    CONSTRAINT fk_user_blocks_blocker FOREIGN KEY (blocker_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_blocks_blocked FOREIGN KEY (blocked_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT chk_block_not_self CHECK (blocker_id <> blocked_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_user_blocks_reverse ON user_blocks(blocked_id);


CREATE TABLE reports (
    id                       CHAR(36) NOT NULL,
    reporter_id              CHAR(36) NOT NULL,
    reported_listing_id      CHAR(36),
    reported_user_id         CHAR(36),
    reported_conversation_id CHAR(36),
    reason                   ENUM('fraudulent','duplicate','sold_still_listed','inappropriate','wrong_info','harassment','other') NOT NULL,
    description               TEXT,
    status                    ENUM('pending','resolved_actioned','resolved_dismissed') NOT NULL DEFAULT 'pending',
    resolved_by               CHAR(36),
    resolved_at                DATETIME,
    resolution_note            TEXT,
    created_at                 DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_reports_reporter FOREIGN KEY (reporter_id) REFERENCES users(id),
    CONSTRAINT fk_reports_listing FOREIGN KEY (reported_listing_id) REFERENCES listings(id),
    CONSTRAINT fk_reports_user FOREIGN KEY (reported_user_id) REFERENCES users(id),
    CONSTRAINT fk_reports_conversation FOREIGN KEY (reported_conversation_id) REFERENCES conversations(id),
    CONSTRAINT fk_reports_resolver FOREIGN KEY (resolved_by) REFERENCES users(id),
    CONSTRAINT chk_report_single_target CHECK (
        (reported_listing_id IS NOT NULL) + (reported_user_id IS NOT NULL) + (reported_conversation_id IS NOT NULL) = 1
    )
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_reports_queue ON reports(status, created_at);
CREATE INDEX idx_reports_conversation ON reports(reported_conversation_id);

CREATE TABLE notifications (
    id                      CHAR(36) NOT NULL,
    user_id                 CHAR(36) NOT NULL,
    type                    ENUM('new_message','listing_archived','listing_removed','report_resolved') NOT NULL,
    related_listing_id      CHAR(36),
    related_conversation_id CHAR(36),
    related_report_id       CHAR(36),
    message_preview         VARCHAR(255),
    is_read                 BOOLEAN NOT NULL DEFAULT FALSE,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_notifications_listing FOREIGN KEY (related_listing_id) REFERENCES listings(id),
    CONSTRAINT fk_notifications_conversation FOREIGN KEY (related_conversation_id) REFERENCES conversations(id),
    CONSTRAINT fk_notifications_report FOREIGN KEY (related_report_id) REFERENCES reports(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_notifications_center ON notifications(user_id, is_read, created_at);

CREATE TABLE exchange_rates (
    id               INT UNSIGNED NOT NULL AUTO_INCREMENT,
    usd_to_syp_rate  DECIMAL(12,4) NOT NULL,
    set_by_admin_id  CHAR(36) NOT NULL,
    effective_from   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_exchange_rates_admin FOREIGN KEY (set_by_admin_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_exchange_rates_latest ON exchange_rates(effective_from);

CREATE TABLE admin_audit_logs (
    id           CHAR(36) NOT NULL,
    admin_id     CHAR(36) NOT NULL,
    action_type  ENUM('archive_listing','remove_listing','suspend_user','reinstate_user','resolve_report','update_reference_data','update_exchange_rate','view_reported_conversation') NOT NULL,
    target_table VARCHAR(50),
    target_id    CHAR(36),
    reason       TEXT,
    created_at   DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_audit_logs_admin FOREIGN KEY (admin_id) REFERENCES users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
CREATE INDEX idx_audit_logs_admin ON admin_audit_logs(admin_id, created_at);
CREATE INDEX idx_audit_logs_target ON admin_audit_logs(target_table, target_id);
