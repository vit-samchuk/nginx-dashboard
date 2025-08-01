const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');
const usersService = require('./users.service');

const login = (username, password) => {
  const user = usersService.findByUsername(username);
  if (!user) return null;

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) return null;

  const token = jwt.sign(user.id, user.username);

  return { token, user };
}

module.exports = {
  login,
};
