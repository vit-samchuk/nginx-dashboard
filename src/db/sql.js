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


sql.createBackupsTable = `
  CREATE TABLE IF NOT EXISTS backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    config_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    hash TEXT NOT NULL,
    backup_reason TEXT NOT NULL DEFAULT '${BACKUP_REASON.AUTO_BEFORE_UPDATE}',
    created_at INTEGER NOT NULL DEFAULT (unixepoch()),
    FOREIGN KEY (config_id) REFERENCES configs(id) ON DELETE CASCADE
  );
`;

module.exports = sql;
