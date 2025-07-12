const express = require('express');
const router = express.Router();

const auth = require("./auth.route");
const configs = require('./configs.route')

router.use('/auth', auth);
router.use('/configs', configs)

module.exports = router;