const User = require('../models/User');
const Job = require('../models/Job');
const Startup = require('../models/Startup');
const Application = require('../models/Application');

// GET /api/admin/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/stats
const getStats = async (req, res) => {
  try {
    const [totalUsers, totalJobs, totalStartups, totalApplications] = await Promise.all([
      User.countDocuments(),
      Job.countDocuments(),
      Startup.countDocuments(),
      Application.countDocuments()
    ]);
    res.json({ totalUsers, totalJobs, totalStartups, totalApplications });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/job-report — applications per job
const getJobReport = async (req, res) => {
  try {
    const jobs = await Job.find().select('title company createdAt isPremium');
    const report = await Promise.all(jobs.map(async (job) => {
      const apps = await Application.find({ jobId: job._id })
        .select('applicantName applicantEmail status appliedAt');
      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        isPremium: job.isPremium,
        createdAt: job.createdAt,
        totalApplications: apps.length,
        applications: apps
      };
    }));
    res.json(report.sort((a, b) => b.totalApplications - a.totalApplications));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/user-report — applications per user
const getUserReport = async (req, res) => {
  try {
    const users = await User.find({ role: 'user' }).select('-password');
    const report = await Promise.all(users.map(async (user) => {
      const apps = await Application.find({ userId: user._id })
        .select('jobTitle company status appliedAt');
      return {
        userId: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        isPremium: user.isPremium,
        profileComplete: user.profileComplete,
        totalApplications: apps.length,
        applications: apps
      };
    }));
    res.json(report.sort((a, b) => b.totalApplications - a.totalApplications));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getUsers, getStats, getJobReport, getUserReport };