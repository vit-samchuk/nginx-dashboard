const { Router } = require('express');
const configsService = require('../services/configs.service')

const handler = require('../utils/async-handler')
const router = Router();

// Configs list
router.get('/list', handler(async (req, res) => {
  const list = configsService.list()
  res.json({ list })
}))

// Get config by id
router.get('/id/:id', handler(async (req, res) => {
  const config = configsService.getConfigById(req.params.id)
  res.json({ config })
}))

// Create config
router.post('/create', handler(async (req, res) => {
  const { name, content } = req.body
  
  if (!name || !content) {
    const err = new Error('Both "name" and "content" are required');
    err.status = 400;
    throw err;
  }
  
  const result = await configsService.createConfig(name, content)
  res.json(result)
}))

// Create and enable
router.post('/create-and-enable', handler(async (req, res) => {
  const { name, content } = req.body
  
  if (!name || !content) {
    const err = new Error('Both "name" and "content" are required');
    err.status = 400;
    throw err;
  }
  
  const config = await configsService.createConfig(name, content)
  const result = await configsService.enableConfig(config.id)
  
  res.json(result)
}))

// Enable config
router.post('/enable/:id', handler(async (req, res) => {
  const result = await configsService.enableConfig(req.params.id)
  
  res.json(result) // { config, ?errors }
}))

// Disable config
router.post('/disable/:id', handler(async (req, res) => {
  const config = await configsService.disableConfig(req.params.id)
  
  res.json(config)
}))

// Update config
router.post('/update/:id', handler(async (req, res) => {
  const { content } = req.body
  
  if (!content) {
    const err = new Error('"content" is required');
    err.status = 400;
    throw err;
  }
  const result = await configsService.updateConfigContent(req.params.id, content)
  
  res.json(result) // { config, ?errors }
}))


// Delete config
router.delete('/:id', handler(async (req, res) => {
  await configsService.deleteConfig(req.params.id)
  
  res.json({ success: true })
}))

// Validate config


// Test and reload nginx
router.post('/nginx-reload', handler(async (req, res) => {
  const result = await configsService.test()
  
  if (result.success) {
    await configService.reload()
  }
  res.json(result)
}))

module.exports = router;