const { Router } = require('express');
const { COOKIE_NAME } = require('../config/constants');
const authService = require('../services/auth.service')
const auth = require('../middleware/auth.middleware')

const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).json({ message: 'Missing credentials' });

  const auth = authService.login(username, password);
  
  if (!auth) return res.status(401).json({ message: 'Incorrect credentials' });

  res.cookie(COOKIE_NAME, auth.token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 24000 * 10 // 10 days
  });

  res.status(200).json({ success: true, message: 'User logged in' });
});

router.post('/logout', (req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
  });

  res.status(200).json({ success: true, message: 'User logged out' });
});

router.get('/me', auth, (req, res) => res.json({ user: req.user }))

module.exports = router;
