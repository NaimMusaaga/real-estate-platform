const CITIES_BY_GOVERNORATE = {
  'دمشق': ['دمشق', 'دوما'],
  'ريف دمشق': ['التل', 'داريا'],
  'حلب': ['حلب', 'أعزاز'],
  'حمص': ['حمص', 'تدمر'],
  'اللاذقية': ['اللاذقية', 'جبلة'],
};

async function seedCities(pool, governorateIds) {
  for (const [govName, cities] of Object.entries(CITIES_BY_GOVERNORATE)) {
    const governorateId = governorateIds[govName];
    for (const cityName of cities) {
      const [existing] = await pool.query(
        'SELECT id FROM cities WHERE governorate_id = ? AND name_ar = ?',
        [governorateId, cityName],
      );
      if (existing.length > 0) continue;
      await pool.query('INSERT INTO cities (governorate_id, name_ar) VALUES (?, ?)', [governorateId, cityName]);
    }
  }
}

module.exports = { seedCities, CITIES_BY_GOVERNORATE };
