const Application = require('../models/Application');
const Job = require('../models/Job');

// @route  POST /api/applications
// @access Private (logged in user)
const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    // Check if already applied
    const existing = await Application.findOne({
      jobId,
      userId: req.user._id
    });

    if (existing) {
      return res.status(400).json({
        message: 'You have already applied for this job'
      });
    }

    // Get job details
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Create application
    const application = await Application.create({
      jobId,
      userId: req.user._id,
      jobTitle: job.title,
      company: job.company,
      applicantName: req.user.name,
      applicantEmail: req.user.email,
      skills: req.user.skills || [],
      experience: req.user.experience || 'fresher'
    });

    res.status(201).json({
      message: 'Application submitted successfully!',
      application
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/applications/my
// @access Private (user sees own applications)
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({ userId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/applications/all
// @access Admin only
const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find({})
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/applications/job/:jobId
// @access Admin only
const getJobApplications = async (req, res) => {
  try {
    const applications = await Application.find({ jobId: req.params.jobId })
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/applications/:id/status
// @access Admin only
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyJob,
  getMyApplications,
  getAllApplications,
  getJobApplications,
  updateStatus
};