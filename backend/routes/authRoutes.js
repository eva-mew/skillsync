const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', (req, res, next) => {
  console.log("🔥 LOGIN ROUTE HIT");   // ← add this
  next();
}, login);

module.exports = router;