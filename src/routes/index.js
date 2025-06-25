const express = require('express');
const router = express.Router();
const auth = require("./auth.route");

router.get('/', (req, res) => {
  return res.send("<h1>Welcome to Nginx Dashboard v0.0.1!</h1>");
})
router.use('/auth', auth);

module.exports = router;