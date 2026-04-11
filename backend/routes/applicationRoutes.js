const express = require('express');
const router = express.Router();
const {
  applyJob,
  getMyApplications,
  getAllApplications,
  getJobApplications,
  updateStatus
} = require('../controllers/applicationController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// User routes
router.post('/', protect, applyJob);
router.get('/my', protect, getMyApplications);

// Admin routes
router.get('/all', protect, adminOnly, getAllApplications);
router.get('/job/:jobId', protect, adminOnly, getJobApplications);
router.put('/:id/status', protect, adminOnly, updateStatus);

module.exports = router;