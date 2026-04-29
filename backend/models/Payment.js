const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: String,
  userEmail: String,
  amount: { type: Number, default: 299 },
  currency: { type: String, default: 'BDT' },
  plan: { type: String, default: 'monthly' },
  transactionId: { type: String, unique: true },
  sessionKey: String,
  status: {
    type: String,
    enum: ['pending', 'success', 'failed', 'cancelled'],
    default: 'pending'
  },
  paidAt: Date,
  expiresAt: Date,
  invoiceNo: String
}, { timestamps: true });

module.exports = mongoose.model('Payment', PaymentSchema);