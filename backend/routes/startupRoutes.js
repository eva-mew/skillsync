const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const Startup = require('../models/Startup');

// GET all startups
router.get('/', async (req, res) => {
  try {
    const { budget, difficulty, category } = req.query;
    let query = {};
    if (budget) query.budget = budget;
    if (difficulty) query.difficulty = difficulty;
    if (category) query.category = category;
    const startups = await Startup.find(query).sort({ createdAt: -1 });
    res.json(startups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single startup
router.get('/:id', async (req, res) => {
  try {
    const startup = await Startup.findById(req.params.id);
    if (!startup) return res.status(404).json({ message: 'Not found' });
    res.json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create startup — admin only
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const startup = await Startup.create(req.body);
    res.status(201).json(startup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE startup — admin only
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Startup.findByIdAndDelete(req.params.id);
    res.json({ message: 'Startup deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;