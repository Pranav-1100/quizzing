const express = require('express');
const { Analytics } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { action, details } = req.body;
    const analytics = await Analytics.create({
      userId: req.user.id,
      action,
      details
    });
    res.status(201).json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const analytics = await Analytics.findAll({
      where: { userId: req.user.id },
      order: [['timestamp', 'DESC']]
    });
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;