const { sqliteTable, text, integer } = require('drizzle-orm/sqlite-core');

const schema = {};

schema.users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  username: text('username').notNull().unique(),
  password: text('password').notNull()
});


module.exports = schema;
