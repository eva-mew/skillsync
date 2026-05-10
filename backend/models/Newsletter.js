const mongoose = require('mongoose');

const NewsletterSchema = new mongoose.Schema({
  name: { type: String, default: 'Subscriber' },
  email: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Newsletter', NewsletterSchema);