const express = require('express');
const userService = require('../services/userService');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/', authMiddleware, async (req, res) => {
  try {
    const { username, email, preferredSubjects, examPreparation, difficultyPreference } = req.body;
    const updatedUser = await userService.updateUser(req.user.id, {
      username,
      email,
      preferredSubjects,
      examPreparation,
      difficultyPreference
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;