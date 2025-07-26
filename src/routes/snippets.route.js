const { Router } = require('express');
const snippetsService = require('../services/snippets.service');
const auth = require('../middleware/auth.middleware');
const handler = require('../utils/async-handler');

const router = Router();

router.get('/list', handler(async (req, res) => {
  const list = snippetsService.getAllSnippets();
  res.json({ list });
}));

router.get('/id/:id', handler(async (req, res) => {
  const snippet = snippetsService.getSnippetById(req.params.id);
  res.json({ snippet });
}));

router.post('/create', auth, handler(async (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    const err = new Error('Both "name" and "content" are required');
    err.status = 400;
    throw err;
  }

  const result = snippetsService.createSnippet(name, content);
  res.json(result);
}));

router.post('/:id', auth, handler(async (req, res) => {
  const { name, content } = req.body;

  if (!name || !content) {
    const err = new Error('Both "name" and "content" are required');
    err.status = 400;
    throw err;
  }

  const result = snippetsService.updateSnippet(req.params.id, { name, content });
  res.json(result);
}));

router.delete('/:id', auth, handler(async (req, res) => {
  await snippetsService.deleteSnippet(req.params.id);
  res.json({ success: true });
}));

module.exports = router;
