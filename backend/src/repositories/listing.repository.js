const pool = require('../config/db');
const { generateId } = require('../utils/uuid.util');

function detailTableFor(propertyType) {
  return {
    residential: 'listing_residential_details',
    commercial: 'listing_commercial_details',
    land: 'listing_land_details',
  }[propertyType];
}

async function insertDetails(conn, listingId, propertyType, details) {
  if (propertyType === 'residential') {
    await conn.query(
      `INSERT INTO listing_residential_details
        (listing_id, bedrooms, bathrooms, floor_number, total_floors, furnishing_status,
         building_year, finishing_condition, payment_terms)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        listingId, details.bedrooms, details.bathrooms, details.floorNumber ?? null,
        details.totalFloors ?? null, details.furnishingStatus, details.buildingYear ?? null,
        details.finishingCondition, details.paymentTerms,
      ],
    );
  } else if (propertyType === 'commercial') {
    await conn.query(
      `INSERT INTO listing_commercial_details
        (listing_id, commercial_subtype, floor_number, frontage_notes, payment_terms)
       VALUES (?, ?, ?, ?, ?)`,
      [listingId, details.commercialSubtype, details.floorNumber ?? null, details.frontageNotes ?? null, details.paymentTerms],
    );
  } else if (propertyType === 'land') {
    await conn.query(
      `INSERT INTO listing_land_details (listing_id, zoning_notes, utilities_connected, payment_terms)
       VALUES (?, ?, ?, ?)`,
      [listingId, details.zoningNotes ?? null, !!details.utilitiesConnected, details.paymentTerms],
    );
  }
}

async function updateDetails(conn, listingId, propertyType, details) {
  const table = detailTableFor(propertyType);
  const columnMaps = {
    residential: {
      bedrooms: 'bedrooms', bathrooms: 'bathrooms', floorNumber: 'floor_number', totalFloors: 'total_floors',
      furnishingStatus: 'furnishing_status', buildingYear: 'building_year',
      finishingCondition: 'finishing_condition', paymentTerms: 'payment_terms',
    },
    commercial: {
      commercialSubtype: 'commercial_subtype', floorNumber: 'floor_number',
      frontageNotes: 'frontage_notes', paymentTerms: 'payment_terms',
    },
    land: { zoningNotes: 'zoning_notes', utilitiesConnected: 'utilities_connected', paymentTerms: 'payment_terms' },
  };
  const columnMap = columnMaps[propertyType];

  const fields = [];
  const params = [];
  for (const [key, column] of Object.entries(columnMap)) {
    if (details[key] !== undefined) {
      fields.push(`${column} = ?`);
      params.push(details[key]);
    }
  }
  if (fields.length === 0) return;
  params.push(listingId);
  await conn.query(`UPDATE ${table} SET ${fields.join(', ')} WHERE listing_id = ?`, params);
}

async function create(ownerId, input) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const id = generateId();
    await conn.query(
      `INSERT INTO listings
        (id, owner_id, property_type, transaction_type, title, description, price_syp, price_usd,
         area_sqm, governorate_id, city_id, neighborhood, address_detail)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id, ownerId, input.propertyType, input.transactionType, input.title, input.description,
        input.priceSyp ?? null, input.priceUsd ?? null, input.areaSqm,
        input.governorateId, input.cityId, input.neighborhood, input.addressDetail ?? null,
      ],
    );

    await insertDetails(conn, id, input.propertyType, input.details);

    await conn.commit();
    return id;
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

// N+1 detail lookups here are a deliberate simplification: at MVP scale (paginated
// lists of ~20 rows), this is simpler to read than a 3-way conditional JOIN and the
// extra queries are trivial primary-key lookups. Revisit only if this is ever slow.
async function attachDetails(listings) {
  const results = [];
  for (const listing of listings) {
    const table = detailTableFor(listing.property_type);
    const [detailRows] = await pool.query(`SELECT * FROM ${table} WHERE listing_id = ?`, [listing.id]);
    results.push({ listing, details: detailRows[0] || null });
  }
  return results;
}

async function findById(id) {
  const [rows] = await pool.query('SELECT * FROM listings WHERE id = ?', [id]);
  const listing = rows[0];
  if (!listing) return null;

  const table = detailTableFor(listing.property_type);
  const [detailRows] = await pool.query(`SELECT * FROM ${table} WHERE listing_id = ?`, [id]);
  return { listing, details: detailRows[0] || null };
}

async function list(filters, pagination) {
  // Joined to users so a suspended owner's listings disappear from public search too (FR-UM-8) —
  // filtering listings.status alone isn't enough once account suspension exists.
  const where = ['l.status = ?', 'u.status = ?'];
  const params = ['active', 'active'];

  if (filters.governorateId) { where.push('l.governorate_id = ?'); params.push(filters.governorateId); }
  if (filters.cityId) { where.push('l.city_id = ?'); params.push(filters.cityId); }
  if (filters.propertyType) { where.push('l.property_type = ?'); params.push(filters.propertyType); }
  if (filters.transactionType) { where.push('l.transaction_type = ?'); params.push(filters.transactionType); }
  if (filters.q) {
    where.push('(l.title LIKE ? OR l.description LIKE ?)');
    params.push(`%${filters.q}%`, `%${filters.q}%`);
  }

  const whereClause = `WHERE ${where.join(' AND ')}`;
  const fromClause = 'FROM listings l JOIN users u ON u.id = l.owner_id';

  const [countRows] = await pool.query(`SELECT COUNT(*) AS count ${fromClause} ${whereClause}`, params);
  const totalCount = countRows[0].count;

  const offset = (pagination.page - 1) * pagination.limit;
  const [rows] = await pool.query(
    `SELECT l.* ${fromClause} ${whereClause} ORDER BY l.created_at DESC LIMIT ? OFFSET ?`,
    [...params, pagination.limit, offset],
  );

  const withDetails = await attachDetails(rows);
  return { rows: withDetails, totalCount };
}

async function listByOwner(ownerId) {
  const [rows] = await pool.query('SELECT * FROM listings WHERE owner_id = ? ORDER BY created_at DESC', [ownerId]);
  return attachDetails(rows);
}

async function countActiveByOwner(ownerId) {
  const [rows] = await pool.query(
    "SELECT COUNT(*) AS count FROM listings WHERE owner_id = ? AND status = 'active'",
    [ownerId],
  );
  return rows[0].count;
}

async function countByStatusAndType() {
  const [rows] = await pool.query(
    `SELECT
       COUNT(*) AS total,
       SUM(status = 'active') AS active,
       SUM(status = 'sold_rented') AS soldOrRented,
       SUM(status = 'archived') AS archived,
       SUM(property_type = 'residential') AS residential,
       SUM(property_type = 'commercial') AS commercial,
       SUM(property_type = 'land') AS land
     FROM listings`,
  );
  return rows[0];
}

async function update(id, propertyType, input) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const updatableColumns = {
      title: 'title', description: 'description', priceSyp: 'price_syp', priceUsd: 'price_usd',
      areaSqm: 'area_sqm', governorateId: 'governorate_id', cityId: 'city_id',
      neighborhood: 'neighborhood', addressDetail: 'address_detail',
      transactionType: 'transaction_type', status: 'status',
    };

    const fields = [];
    const params = [];
    for (const [key, column] of Object.entries(updatableColumns)) {
      if (input[key] !== undefined) {
        fields.push(`${column} = ?`);
        params.push(input[key]);
      }
    }
    if (fields.length > 0) {
      params.push(id);
      await conn.query(`UPDATE listings SET ${fields.join(', ')} WHERE id = ?`, params);
    }

    if (input.details) {
      await updateDetails(conn, id, propertyType, input.details);
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

async function remove(id) {
  await pool.query('DELETE FROM listings WHERE id = ?', [id]);
}

module.exports = {
  create,
  findById,
  list,
  listByOwner,
  update,
  remove,
  countActiveByOwner,
  countByStatusAndType,
};
