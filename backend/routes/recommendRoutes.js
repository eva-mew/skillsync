const express = require('express');
const router = express.Router();
const {
  getRecommendedJobs,
  getRecommendedStartups
} = require('../controllers/recommendController');
const { protect } = require('../middleware/authMiddleware');

router.get('/jobs', protect, getRecommendedJobs);
router.get('/startups', protect, getRecommendedStartups);

module.exports = router;