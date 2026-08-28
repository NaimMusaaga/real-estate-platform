// Minimal seed for local dev/demo — 5 governorates, not the full 14.
// Populating all of Syria's governorates/cities is a data-entry task, not a code task.
const GOVERNORATES = [
  { name_ar: 'دمشق', sort_order: 1 },
  { name_ar: 'ريف دمشق', sort_order: 2 },
  { name_ar: 'حلب', sort_order: 3 },
  { name_ar: 'حمص', sort_order: 4 },
  { name_ar: 'اللاذقية', sort_order: 5 },
];

async function seedGovernorates(pool) {
  const ids = {};
  for (const gov of GOVERNORATES) {
    const [existing] = await pool.query('SELECT id FROM governorates WHERE name_ar = ?', [gov.name_ar]);
    if (existing.length > 0) {
      ids[gov.name_ar] = existing[0].id;
      continue;
    }
    const [result] = await pool.query(
      'INSERT INTO governorates (name_ar, sort_order) VALUES (?, ?)',
      [gov.name_ar, gov.sort_order],
    );
    ids[gov.name_ar] = result.insertId;
  }
  return ids;
}

module.exports = { seedGovernorates, GOVERNORATES };
