const express = require('express');
const router = express.Router();

const { protect, adminOnly } = require('../middleware/authMiddleware');

const {
  submitContact,
  getMyMessages,
  getAllMessages,
  replyMessage,
  markAsRead,
  deleteMessage,
  subscribe,
  getSubscribers,
  deleteSubscriber
} = require('../controllers/contactController');

// Public routes
router.post('/submit', submitContact);
router.post('/subscribe', subscribe);

// User routes
router.get('/my-messages', protect, getMyMessages);

// Admin routes
router.get('/all', protect, adminOnly, getAllMessages);
router.put('/reply/:id', protect, adminOnly, replyMessage);
router.put('/read/:id', protect, adminOnly, markAsRead);
router.delete('/:id', protect, adminOnly, deleteMessage);

router.get('/subscribers', protect, adminOnly, getSubscribers);
router.delete('/subscribers/:id', protect, adminOnly, deleteSubscriber);

module.exports = router;