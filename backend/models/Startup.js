const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: String,
  requiredSkills: [String],
  budget: {
    type: String,
    enum: ['zero', 'low', 'medium', 'high'],
    default: 'zero'
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner'
  },
  estimatedCost: String,
  potentialRevenue: String,
  timeToLaunch: String,
  viabilityScore: Number,
  roadmap: [String],
  resources: [{
    title: String,
    url: String
  }],
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Startup', StartupSchema);