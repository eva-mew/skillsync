const express = require('express');
const router = express.Router();
const {
  getUsers, getStats, getJobReport, getUserReport,
  getMonthlyApplications, getApplicationsByDate, getJobApplicants, postJob, toggleJobStatus
} = require('../controllers/adminController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/users',                   protect, adminOnly, getUsers);
router.get('/stats',                   protect, adminOnly, getStats);
router.get('/job-report',              protect, adminOnly, getJobReport);
router.get('/user-report',             protect, adminOnly, getUserReport);
router.get('/monthly-applications',    protect, adminOnly, getMonthlyApplications);
router.get('/applications-by-date',    protect, adminOnly, getApplicationsByDate);
router.get('/job/:jobId/applicants',   protect, adminOnly, getJobApplicants);
router.post('/jobs',                   protect, adminOnly, postJob);
router.patch('/jobs/:id/toggle',       protect, adminOnly, toggleJobStatus);
module.exports = router;