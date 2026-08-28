// Runs schema.sql against the already-created database (see ../../README.md).
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../config/env');

async function migrate() {
  const schemaSql = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

  const connection = await mysql.createConnection({
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    database: env.db.database,
    multipleStatements: true,
  });

  console.log(`Running schema.sql against database "${env.db.database}"...`);
  await connection.query(schemaSql);
  console.log('Migration complete.');

  await connection.end();
}

migrate().catch((err) => {
  console.error('Migration failed:', err.message);
  process.exit(1);
});
