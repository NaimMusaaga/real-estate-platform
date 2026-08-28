const pool = require('../config/db');

async function findAllGovernorates() {
  const [rows] = await pool.query(
    'SELECT id, name_ar FROM governorates WHERE is_active = TRUE ORDER BY sort_order, name_ar',
  );
  return rows;
}

async function findCitiesByGovernorate(governorateId) {
  const [rows] = await pool.query(
    'SELECT id, governorate_id, name_ar FROM cities WHERE governorate_id = ? AND is_active = TRUE ORDER BY name_ar',
    [governorateId],
  );
  return rows;
}

async function findCityById(cityId) {
  const [rows] = await pool.query('SELECT * FROM cities WHERE id = ?', [cityId]);
  return rows[0] || null;
}

module.exports = { findAllGovernorates, findCitiesByGovernorate, findCityById };
