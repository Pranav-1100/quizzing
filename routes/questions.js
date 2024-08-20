const express = require('express');
const questionService = require('../services/questionService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { topic, difficulty, examType, count, type } = req.body;
    const questions = await questionService.generateQuestions(req.user.id, topic, difficulty, examType, count, type);
    res.status(201).json(questions);
  } catch (error) {
    console.error('Error in generate questions route:', error);
    res.status(500).json({ error: error.message });
  }
});

router.get('/by-difficulty/:difficulty', authMiddleware, async (req, res) => {
  try {
    const questions = await questionService.getQuestionsByDifficulty(req.user.id, req.params.difficulty);
    res.json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;