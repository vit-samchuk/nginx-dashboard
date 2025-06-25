const Database = require('better-sqlite3');
const path = require('path');
const { drizzle } = require('drizzle-orm/better-sqlite3');
const schema = require('./schema');
const sql = require('./sql');
const bcrypt = require('bcrypt');

const sqlite = new Database(path.resolve(__dirname, 'app.db'));
const db = drizzle(sqlite, { schema });

function initDb() {
  try {
    sqlite
      .prepare(sql.createUsersTable)
      .run();
  } catch (e) {
    console.error('DB init error:', e);
    process.exit(1);
  }
}

function initDefaultData() {
  const existing = db.select().from(schema.users).get();

  if (!existing) {
    const hashed = bcrypt.hashSync('admin', 10);
    db.insert(schema.users).values({
      username: 'admin',
      password: hashed
    }).run();

    console.log('✅ Default admin user created (username: admin, password: admin)');
  }
}

initDb();
initDefaultData();

module.exports = db;
