const pool = require('../config/db');
const { seedGovernorates } = require('./seeds/governorates.seed');
const { seedCities } = require('./seeds/cities.seed');

async function run() {
  const governorateIds = await seedGovernorates(pool);
  await seedCities(pool, governorateIds);
  console.log('Reference data seeded (governorates + cities).');
  process.exit(0);
}

run().catch((err) => {
  console.error('Seeding reference data failed:', err.message);
  process.exit(1);
});
