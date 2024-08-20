const express = require('express');
const noteService = require('../services/noteService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { topic, examType, format } = req.body;
    const note = await noteService.generateNotes(req.user.id, topic, examType, format);
    res.status(201).json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/share', authMiddleware, async (req, res) => {
  try {
    const note = await noteService.shareNote(req.params.id);
    res.json(note);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/flashcards', authMiddleware, async (req, res) => {
  try {
    const flashcards = await noteService.generateFlashcards(req.params.id);
    res.json(flashcards);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;