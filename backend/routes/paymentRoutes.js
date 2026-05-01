const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getMyPayments,
  getPremiumStatus,
  getInvoice,
  paymentIPN
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/init', protect, initiatePayment);
router.post('/success', paymentSuccess);
router.post('/fail', paymentFail);
router.post('/cancel', paymentCancel);
router.get('/my', protect, getMyPayments);
router.get('/status', protect, getPremiumStatus);
router.get('/invoice/:txn', protect, getInvoice);
router.post('/ipn', paymentIPN);


module.exports = router;