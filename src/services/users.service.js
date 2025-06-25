const db = require('../db/db');
const { eq } = require('drizzle-orm');
const { users } = require('../db/schema');

const findByUsername = (username) => {
  return db.select().from(users).where(eq(users.username, username)).get();
}

module.exports = {
  findByUsername,
};
