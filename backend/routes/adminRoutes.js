const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  deleteUser,
  getStats
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/users', protect, adminOnly, getAllUsers);
router.delete('/users/:id', protect, adminOnly, deleteUser);
router.get('/stats', protect, adminOnly, getStats);

module.exports = router;