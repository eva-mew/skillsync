const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  applyJob, getUserApplications, getAllApplications,
  getJobApplications, updateStatus, downloadCV, uploadMiddleware
} = require('../controllers/applicationController');

// User routes
router.post('/', auth, uploadMiddleware, applyJob);
router.get('/my', auth, getUserApplications);
router.get('/cv/:id', auth, downloadCV);

// Admin routes
router.get('/all', auth, getAllApplications);
router.get('/job/:jobId', auth, getJobApplications);
router.put('/:id/status', auth, updateStatus);

module.exports = router;