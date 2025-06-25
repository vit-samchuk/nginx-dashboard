const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/constants');

const sign = (id, username) => jwt.sign(
    { id, username },
    JWT_SECRET
  );

const verify = (token) => jwt.verify(token, JWT_SECRET);
  
module.exports = { sign, verify }
