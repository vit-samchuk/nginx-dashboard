const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');
const drizzle = require('drizzle-orm');
const sql = drizzle.sql;

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
  validation_error: text('validation_error'),
  last_modified: integer('last_modified', { mode: 'timestamp' }).notNull(),
  description: text('description'),
  enabled: integer('enabled', { mode: 'boolean' }).notNull().default(false),
  tags: text('tags'),
})

schema.snippets = sqliteTable('snippets', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
  content: text('content').notNull(),
})


module.exports = schema;
