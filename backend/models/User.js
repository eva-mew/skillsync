const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Module 2 — Profile
  skills: [String],
  experience: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior'],
    default: 'fresher'
  },
  interests: [String],
  budget: {
    type: String,
    enum: ['zero', 'low', 'medium', 'high'],
    default: 'zero'
  },
  workPreference: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid', 'any'],
    default: 'any'
  },
  profileComplete: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);