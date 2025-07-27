const { CONFIG_VALIDATION, BACKUP_REASON } = require('../config/constants');

const sql = {};

sql.createUsersTable = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  );
`;

sql.createConfigsTable = `
  CREATE TABLE IF NOT EXISTS configs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    hash TEXT NOT NULL,
    validation_status TEXT DEFAULT '${CONFIG_VALIDATION.UNKNOWN}',
    validation_error TEXT,
    last_modified INTEGER NOT NULL,
    description TEXT,
    enabled INTEGER NOT NULL DEFAULT 0,
    tags TEXT
  );
`;


sql.createSnippetsTable = `
  CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    content TEXT NOT NULL,
    name TEXT NOT NULL UNIQUE
  );
`;

module.exports = sql;
