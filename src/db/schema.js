const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');
const { CONFIG_VALIDATION } = require('../config/constants')

const schema = {};

schema.users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull()
});

schema.configs = sqliteTable('configs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  path: text('path').notNull().unique(),
  content: text('content').notNull(),
  hash: text('hash').notNull(),
  validation_status: text('validation_status').default(CONFIG_VALIDATION.UNKNOWN),
  last_modified: integer('last_modified', { mode: 'timestamp' }).notNull(),
  description: text('description'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(false),
  tags: text('tags'),
})

schema.backups = sqliteTable('backups', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  config_id: integer('config_id').notNull().references(() => configs.id, { onDelete: 'cascade' }),
  content: text('content').notNull(),
  hash: text('hash').notNull(),
  backup_reason: text('backup_reason').notNull().default('auto_before_update'),
  created_at: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
})


module.exports = schema;
