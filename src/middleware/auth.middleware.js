const jwt = require('../utils/jwt');
const { COOKIE_NAME } = require('../config/constants');


function authMiddleware(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  console.log(token)
  try {
    const user = jwt.verify(token);
    req.user = user;
    next();
  } catch (e) {
    console.log(e);
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
