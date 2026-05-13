const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  jobId:          { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
  jobTitle:       { type: String },
  company:        { type: String },
  applicantName:  { type: String },
  applicantEmail: { type: String },
  skills:         [String],
  experience:     { type: String },
  matchScore:     { type: Number, default: 0 },
  // CV upload
  cvFileName:     { type: String },
  cvData:         { type: Buffer },
  cvMimeType:     { type: String },
  // Status
  status: { type: String, default: 'pending' },
statusReason: { type: String, default: '' },
  adminNote:  { type: String, default: '' },
  appliedAt:  { type: Date, default: Date.now },
  
});


module.exports = mongoose.model('Application', ApplicationSchema);