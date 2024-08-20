const express = require('express');
const studyGroupService = require('../services/studyGroupService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const group = await studyGroupService.createGroup(name, description, req.user.id);
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/join', authMiddleware, async (req, res) => {
  try {
    const group = await studyGroupService.addMember(req.params.id, req.user.id);
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/share', authMiddleware, async (req, res) => {
  try {
    const { contentType, contentId } = req.body;
    const group = await studyGroupService.shareContent(req.params.id, req.user.id, contentType, contentId);
    res.json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id/content', authMiddleware, async (req, res) => {
  try {
    const content = await studyGroupService.getSharedContent(req.params.id);
    res.json(content);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;