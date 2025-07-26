const express = require('express');
const router = express.Router();

const auth = require("./auth.route");
const configs = require('./configs.route')
const snippets = require('./snippets.route.js')

router.use('/auth', auth);
router.use('/configs', configs);
router.use('/snippets', snippets);

module.exports = router;