const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  // If logged in user
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Form fields
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  // Status
  status: { type: String, enum: ['unread', 'read', 'replied'], default: 'unread' },
  // Admin reply
  adminReply: { type: String, default: '' },
  repliedAt: { type: Date },
  // Timestamps
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);