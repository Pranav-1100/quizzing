const express = require('express');
const quizService = require('../services/quizService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/create', authMiddleware, async (req, res) => {
  try {
    const { title, subjectOrTags, questionCount } = req.body;
    const quiz = await quizService.createQuiz(req.user.id, title, subjectOrTags, questionCount);
    res.status(201).json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/submit', authMiddleware, async (req, res) => {
  try {
    const { answers } = req.body;
    const quiz = await quizService.submitQuizAnswers(req.params.id, answers);
    res.json(quiz);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id/results', authMiddleware, async (req, res) => {
  try {
    const results = await quizService.getQuizResults(req.params.id);
    res.json(results);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;