const User = require('../models/User');
const Job = require('../models/Job');
const Startup = require('../models/Startup');
const Application = require('../models/Application');

// @route  GET /api/admin/users
// @access Admin only
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  DELETE /api/admin/users/:id
// @access Admin only
const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role === 'admin') {
      return res.status(400).json({ message: 'Cannot delete admin user' });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  GET /api/admin/stats
// @access Admin only
const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalJobs = await Job.countDocuments();
    const totalStartups = await Startup.countDocuments();
const totalApplications = await Application.countDocuments();
    res.json({
      totalUsers,
      totalJobs,
      totalStartups,
      totalApplications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = { getAllUsers, deleteUser, getStats };