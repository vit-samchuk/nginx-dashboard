const jwt = require('../utils/jwt');
const { COOKIE_NAME } = require('../config/constants');


function authMiddleware(req, res, next) {
  const token = req.cookies[COOKIE_NAME];
  console.log(`[auth token] ${!!token}`)
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  console.log(token)
  try {
    const { id, username } = jwt.verify(token);
    req.user = { id, username };
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
