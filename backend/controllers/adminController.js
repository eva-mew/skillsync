const User = require('../models/User');
const Job = require('../models/Job');
const Startup = require('../models/Startup');
const Application = require('../models/Application');
const Payment = require('../models/Payment');
const { sendJobPostedConfirmation } = require('../utils/emailService');
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
// GET /api/admin/monthly-applications
const getMonthlyApplications = async (req, res) => {
  try {
    const data = await Application.aggregate([
      {
        $group: {
          _id: { month: { $month: '$appliedAt' }, year: { $year: '$appliedAt' } },
          total: { $sum: 1 },
          shortlisted: { $sum: { $cond: [{ $eq: ['$status', 'shortlisted'] }, 1, 0] } },
          rejected:    { $sum: { $cond: [{ $eq: ['$status', 'rejected']    }, 1, 0] } },
          pending:     { $sum: { $cond: [{ $eq: ['$status', 'pending']     }, 1, 0] } },
          selected: { $sum: { $cond: [{ $eq: ['$status', 'selected'] }, 1, 0] } },
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    res.json(data.map(d => ({
      label: `${months[d._id.month - 1]} ${d._id.year}`,
      month: d._id.month, year: d._id.year,
      total: d.total, shortlisted: d.shortlisted,
      rejected: d.rejected, pending: d.pending, selected: d.selected
    })));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/applications-by-date?start=2026-01-01&end=2026-01-31
const getApplicationsByDate = async (req, res) => {
  try {
    const { start, end } = req.query;
    const filter = {};
    if (start || end) {
      filter.appliedAt = {};
      if (start) filter.appliedAt.$gte = new Date(start);
      if (end)   filter.appliedAt.$lte = new Date(new Date(end).setHours(23, 59, 59, 999));
    }
    const apps = await Application.find(filter).sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/job/:jobId/applicants
const getJobApplicants = async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId }).sort({ appliedAt: -1 });
    res.json(apps);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
// POST /api/admin/jobs
const postJob = async (req, res) => {
  try {
    const job = new Job({
      ...req.body,
      postedBy: req.user._id,
      deadline: req.body.deadline || null,
      isActive: true,
    });

    await job.save();

    // Email to admin
    await sendJobPostedConfirmation(
      req.user.email,
      job.title,
      job.company
    );

    res.status(201).json(job);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
// GET /api/admin/revenue
const getRevenueReport = async (req, res) => {
  try {
    const data = await Payment.aggregate([
      { $match: { status: 'success' } },
      {
        $group: {
          _id: { month: { $month: '$paidAt' }, year: { $year: '$paidAt' } },
          totalRevenue: { $sum: '$amount' },
          totalSubscribers: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const monthly = data.map(d => ({
      label: `${months[d._id.month - 1]} ${d._id.year}`,
      revenue: d.totalRevenue,
      subscribers: d.totalSubscribers
    }));
    const totalRevenue = monthly.reduce((sum, m) => sum + m.revenue, 0);
    const totalSubscribers = monthly.reduce((sum, m) => sum + m.subscribers, 0);
    res.json({ monthly, totalRevenue, totalSubscribers });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
// GET /api/admin/premium-users
const getPremiumUsers = async (req, res) => {
  try {
    const users = await User.find({ isPremium: true }).select('-password').sort({ premiumExpiresAt: 1 });
    const report = await Promise.all(users.map(async (user) => {
      const apps = await Application.find({ userId: user._id })
        .select('jobTitle company status appliedAt matchScore cvFileName _id jobId')
        .sort({ appliedAt: -1 });
      const payments = await Payment.find({ userId: user._id, status: 'success' })
        .select('amount paidAt invoiceNo transactionId')
        .sort({ paidAt: -1 });
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        experience: user.experience,
        profileComplete: user.profileComplete,
        isPremium: user.isPremium,
        premiumExpiresAt: user.premiumExpiresAt,
        createdAt: user.createdAt,
        applications: apps,
        payments
      };
    }));
    res.json(report);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// GET /api/admin/cv-applications
const getCVApplications = async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    const report = await Promise.all(jobs.map(async (job) => {
      const apps = await Application.find({ jobId: job._id })
        .select('applicantName applicantEmail matchScore skills status cvFileName appliedAt _id userId')
        .sort({ matchScore: -1 });
      return {
        jobId: job._id,
        title: job.title,
        company: job.company,
        isPremium: job.isPremium,
        isActive: job.isActive,
        totalApplications: apps.length,
        applications: apps
      };
    }));
    res.json(report.filter(j => j.totalApplications > 0));
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// PATCH /api/admin/jobs/:id/toggle
const toggleJobStatus = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: 'Job not found'
      });
    }

    job.isActive = !job.isActive;

    await job.save();

    res.json({
      message: `Job ${job.isActive ? 'activated' : 'closed'}`,
      job
    });

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
module.exports = { getUsers, getStats, getJobReport, getUserReport, getMonthlyApplications, getApplicationsByDate, getJobApplicants, postJob, toggleJobStatus, getRevenueReport, getPremiumUsers, getCVApplications };