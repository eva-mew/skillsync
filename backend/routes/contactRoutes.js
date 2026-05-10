const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
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

// User routes (auth required)
router.get('/my-messages', auth, getMyMessages);

// Admin routes (auth required — add admin check in controller or middleware)
router.get('/all', auth, getAllMessages);
router.put('/reply/:id', auth, replyMessage);
router.put('/read/:id', auth, markAsRead);
router.delete('/:id', auth, deleteMessage);
router.get('/subscribers', auth, getSubscribers);
router.delete('/subscribers/:id', auth, deleteSubscriber);

module.exports = router;