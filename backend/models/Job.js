const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  requiredSkills: [String],
  location: String,
  salary: String,
  type: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship'],
    default: 'full-time'
  },
  workMode: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'remote'
  },
  experience: {
    type: String,
    enum: ['fresher', 'junior', 'mid', 'senior'],
    default: 'fresher'
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isPremium: { type: Boolean, default: false },
companyLogo: { type: String, default: '' },
companyDescription: { type: String, default: '' },
companyWebsite: { type: String, default: '' },
companySize: { type: String, default: '' },
companyLocation: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Job', JobSchema);