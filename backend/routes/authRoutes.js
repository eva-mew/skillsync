const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', (req, res, next) => {
  console.log("🔥 LOGIN ROUTE HIT");
  next();
}, login);

// Fresh user data — used by AuthContext on app load
router.get('/me', protect, getMe);

module.exports = router;