const express = require('express');
const studyPlanService = require('../services/studyPlanService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/generate', authMiddleware, async (req, res) => {
  try {
    const { examDate, subjects } = req.body;
    const studyPlan = await studyPlanService.generateStudyPlan(req.user.id, examDate, subjects);
    res.status(201).json(studyPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/progress', authMiddleware, async (req, res) => {
  try {
    const { progress } = req.body;
    const studyPlan = await studyPlanService.updateProgress(req.params.id, progress);
    res.json(studyPlan);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;