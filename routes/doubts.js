const express = require('express');
const doubtService = require('../services/doubtService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, content, subject } = req.body;
    const doubt = await doubtService.createDoubt(req.user.id, title, content, subject);
    res.status(201).json(doubt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { page, limit } = req.query;
    const doubts = await doubtService.getAllDoubts(parseInt(page), parseInt(limit));
    res.json(doubts);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const doubt = await doubtService.getDoubtById(req.params.id);
    if (!doubt) {
      return res.status(404).json({ error: 'Doubt not found' });
    }
    res.json(doubt);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const { content, isResolution } = req.body;
    const comment = await doubtService.addComment(req.user.id, req.params.id, content, isResolution);
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/resolve', authMiddleware, async (req, res) => {
  try {
    await doubtService.markAsResolved(req.params.id);
    res.json({ message: 'Doubt marked as resolved' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;