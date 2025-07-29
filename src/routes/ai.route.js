const { Router } = require('express');
const aiService = require('../services/ai.service');
const auth = require('../middleware/auth.middleware');
const handler = require('../utils/async-handler');

const router = Router();

router.post('/ai/write', handler(async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    const err = new Error('"prompt" is required');
    err.status = 400;
    throw err;
  }

  const result = await aiService.writeConfig(prompt);
  res.json({ result });
}));

router.post('/ai/format', handler(async (req, res) => {
  const { config } = req.body;

  if (!config) {
    const err = new Error('"config" is required');
    err.status = 400;
    throw err;
  }

  const result = await aiService.formatConfig(config);
  res.json({ result });
}));

router.post('/ai/edit', handler(async (req, res) => {
  const { config, prompt } = req.body;

  if (!config || !prompt) {
    const err = new Error('"config" and "prompt" are required');
    err.status = 400;
    throw err;
  }

  const result = await aiService.editConfig(config, prompt);
  res.json({ result });
}));

module.exports = router;
