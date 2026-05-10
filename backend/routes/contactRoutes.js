const express = require('express');
const router = express.Router();
const {
  submitContact, getAllMessages, getMyMessages,
  replyMessage, markAsRead, deleteMessage,
  subscribeNewsletter, getSubscribers, deleteSubscriber
} = require('../controllers/contactController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public
router.post('/submit', submitContact);
router.post('/newsletter', subscribeNewsletter);

// User
router.get('/my', protect, getMyMessages);

// Admin
router.get('/all', protect, adminOnly, getAllMessages);
router.get('/subscribers', protect, adminOnly, getSubscribers);
router.put('/:id/reply', protect, adminOnly, replyMessage);
router.put('/:id/read', protect, adminOnly, markAsRead);
router.delete('/subscribers/:id', protect, adminOnly, deleteSubscriber);
router.delete('/:id', protect, adminOnly, deleteMessage);

module.exports = router;