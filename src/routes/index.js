const express = require('express');
const router = express.Router();

const auth = require("./auth.route");
const configs = require('/configs.route')

router.get('/', (req, res) => res.send("<h1>Welcome to Nginx Dashboard v0.0.1!</h1>"))
router.use('/auth', auth);
router.use('/configs', configs)

module.exports = router;