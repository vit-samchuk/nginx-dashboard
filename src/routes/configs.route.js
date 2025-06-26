const { Router } = require('express');
const configsService = require('../services/configs.service')

const router = Router();

router.get('/list', (req, res) => {
  const list = configsService.list()
  res.json({ list })
})

module.exports = router;