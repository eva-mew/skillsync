const express = require('express');
const router = express.Router();
const { getUsers, getStats, getJobReport, getUserReport } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/users', protect, adminOnly, getUsers);
router.get('/stats', protect, adminOnly, getStats);
router.get('/job-report', protect, adminOnly, getJobReport);
router.get('/user-report', protect, adminOnly, getUserReport);

module.exports = router;