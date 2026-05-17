const express = require('express');
const router = express.Router();
const {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, adminOnly, optionalProtect } = require('../middleware/authMiddleware');

// পুরনো duplicate lines সব গেছে — শুধু এগুলো থাকবে
router.get('/', optionalProtect, getJobs);
router.get('/:id', optionalProtect, getJobById);
router.post('/', protect, adminOnly, createJob);
router.put('/:id', protect, adminOnly, updateJob);
router.delete('/:id', protect, adminOnly, deleteJob);

module.exports = router;