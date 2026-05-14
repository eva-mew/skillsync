const Application = require('../models/Application');
const User = require('../models/User');
const Job = require('../models/Job');

const {
  sendApplicationConfirmation,
  sendStatusUpdate
} = require('../utils/emailService');
// ── Apply for a job ──────────────────────────────────────────────────────────
exports.applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.user._id;

    // Get user profile
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Get job
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

 // ── Skill match check ─────────────────────────────────────────────────

if (!user.skills || user.skills.length === 0) {
  return res.status(400).json({
    message: 'Please complete your profile and add skills before applying.'
  });
}

// Normalize helper
const normalizeSkill = (skill) => {
  if (!skill) return '';

  // object support
  if (typeof skill === 'object') {
    skill = skill.name || '';
  }

  return skill
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9+#.]/g, '')
    .trim();
};

// Safe arrays
const userSkills = Array.isArray(user.skills)
  ? user.skills
  : [];

const jobSkills = Array.isArray(job.requiredSkills)
  ? job.requiredSkills
  : [];

// Normalize
const userSkillsLower = userSkills.map(normalizeSkill);
const jobSkillsLower = jobSkills.map(normalizeSkill);

// Match
const matchedSkills = jobSkillsLower.filter(skill =>
  userSkillsLower.includes(skill)
);

// DEBUG
console.log('USER RAW:', user.skills);
console.log('JOB RAW:', job.requiredSkills);

console.log('USER NORMALIZED:', userSkillsLower);
console.log('JOB NORMALIZED:', jobSkillsLower);

console.log('MATCHED:', matchedSkills);

if (matchedSkills.length === 0) {
  return res.status(400).json({
    message: `You need at least 1 matching skill to apply. This job requires: ${jobSkills.join(', ')}`
  });
}
    // Calculate match score
    const matchScore = Math.round(
      (matchedSkills.length / job.requiredSkills.length) * 70 +
      (user.workPreference === job.workMode ? 20 : 0) +
      (user.experience === job.experience ? 10 : 0)
    );

    // ── Duplicate check ────────────────────────────────────────────────────
    const existing = await Application.findOne({ userId, jobId });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this job' });
    }

    // ── CV check ───────────────────────────────────────────────────────────
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload your CV to apply.' });
    }

    // ── Create application ─────────────────────────────────────────────────
    const application = await Application.create({
      userId,
      jobId,
      jobTitle: job.title,
      company:  job.company,
      applicantName:  user.name,
      applicantEmail: user.email,
      skills:     user.skills,
      experience: user.experience,
      matchScore,
      cvFileName: req.file.originalname,
      cvData:     req.file.buffer,
      cvMimeType: req.file.mimetype,
      status: 'pending'
    });
// Send confirmation email
res.status(201).json({
  message: 'Application submitted successfully!',
  applicationId: application._id,
  matchScore
});

// send email AFTER response
sendApplicationConfirmation(
  user.email,
  user.name,
  job.title,
  job.company
).catch(err => console.log(err));  } catch (err) {
    res.status(500).json({ message: err.message });  }
};

// ── Get user's own applications ───────────────────────────────────────────────
exports.getUserApplications = async (req, res) => {
  try {
    const apps = await Application.find({ userId: req.user._id })
      .select('-cvData') // don't send binary data
      .sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: get all applications ───────────────────────────────────────────────
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find()
      .select('-cvData') // don't send binary in list
      .sort({ matchScore: -1, appliedAt: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: get applications for a specific job ────────────────────────────────
exports.getJobApplications = async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      .select('-cvData')
      .sort({ matchScore: -1 });
    res.json(apps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Admin: update application status ─────────────────────────────────────────
exports.updateStatus = async (req, res) => {
  try {
    const { status, adminNote } = req.body;

    const validStatuses = [
      'pending',
      'viewed',
      'shortlisted',
      'rejected',
      'selected'
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    let app = await Application.findById(req.params.id);

    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }

    // update
    app.status = status;
    if (adminNote !== undefined) {
      app.adminNote = adminNote;
    }

    await app.save();

    // IMPORTANT: populate user AFTER save
    await app.populate('userId', 'name email');

    console.log("EMAIL DEBUG:");
    console.log(app.userId);

    // email send
    if (app.userId?.email) {
      await sendStatusUpdate(
        app.userId.email,
        app.userId.name,
        app.jobTitle,
        app.company,
        status
      );
    }

    res.json(app);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── Serve CV file ─────────────────────────────────────────────────────────────
exports.downloadCV = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id).select('cvData cvMimeType cvFileName userId');
    if (!app || !app.cvData) return res.status(404).json({ message: 'CV not found' });

    // Only admin or the applicant themselves can download
    const requesterId = req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    const isOwner = app.userId.toString() === requesterId;
    if (!isAdmin && !isOwner) return res.status(403).json({ message: 'Access denied' });

    res.set('Content-Type', app.cvMimeType);
    res.set('Content-Disposition', `inline; filename="${app.cvFileName}"`);
    res.send(app.cvData);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// Admin: delete application
exports.deleteApplication = async (req, res) => {
  try {
    const app = await Application.findByIdAndDelete(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });
    res.json({ message: 'Application deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};