const mongoose = require('mongoose');

const SavedItemSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  itemType: {
    type: String,
    enum: ['job', 'startup'],
    required: true
  },
  itemTitle: String,
  itemCompany: String
}, { timestamps: true });

module.exports = mongoose.model('SavedItem', SavedItemSchema);