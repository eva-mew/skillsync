const User = require('../models/User');

// Smart profile strength calculation
const calculateStrength = (user) => {
  let score = 0;

  // Skills — 40 points (most important)
  if (user.skills && user.skills.length >= 5) score += 40;
  else if (user.skills && user.skills.length >= 3) score += 28;
  else if (user.skills && user.skills.length >= 1) score += 15;

  // Experience — 20 points
  if (user.experience && user.experience !== '') score += 20;

  // Work preference — 15 points
  if (user.workPreference && user.workPreference !== '') score += 15;

  // Interests — 15 points
  if (user.interests && user.interests.length >= 3) score += 15;
  else if (user.interests && user.interests.length >= 1) score += 8;

  // Budget — 5 points
  if (user.budget && user.budget !== '') score += 5;

  // Name + Email — 5 points (always filled after registration)
  if (user.name && user.email) score += 5;

  return Math.min(score, 100);
};
// @route  GET /api/profile
// @access Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @route  PUT /api/profile
// @access Private
const updateProfile = async (req, res) => {
  try {
    const { skills, experience, interests, budget, workPreference } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (skills) user.skills = skills;
    if (experience) user.experience = experience;
    if (interests) user.interests = interests;
    if (budget) user.budget = budget;
    if (workPreference) user.workPreference = workPreference;

    // Calculate profile strength
    user.profileComplete = calculateStrength(user);

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      skills: updatedUser.skills,
      experience: updatedUser.experience,
      interests: updatedUser.interests,
      budget: updatedUser.budget,
      workPreference: updatedUser.workPreference,
      profileComplete: updatedUser.profileComplete
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProfile, updateProfile };