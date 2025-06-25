const express = require('express');
const { COOKIE_NAME } = require('../config/constants');
const authService = require('../services/auth.service')
const auth = require('../middleware/auth.middleware')
const router = express.Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });

  const { token, user } = authService.login(username, password);
  
  res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24000 * 10 // 10 days
  });

  res.json({ message: 'OK' });
});

router.get('/me', auth, (req, res) => res.json({ user: req.user }))

module.exports = router;
