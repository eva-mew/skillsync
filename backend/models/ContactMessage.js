const mongoose = require('mongoose');

const ContactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String, default: 'General Inquiry' },
  message: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reply: { type: String, default: null },
  repliedAt: { type: Date, default: null },
  repliedBy: { type: String, default: null },
  status: {
    type: String,
    enum: ['unread', 'read', 'replied'],
    default: 'unread'
  }
}, { timestamps: true });

module.exports = mongoose.model('ContactMessage', ContactMessageSchema);