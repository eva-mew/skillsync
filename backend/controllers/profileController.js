const User = require('../models/User');

// Calculate profile strength
const calcProfileStrength = (user) => {
  let score = 0;
  if (user.name) score += 10;
  if (user.email) score += 10;
  if (user.skills?.length > 0) score += 20;
  if (user.skills?.length >= 3) score += 10;
  if (user.experience) score += 15;
  if (user.interests?.length > 0) score += 15;
  if (user.budget) score += 10;
  if (user.workPreference) score += 10;
  return score;
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
    user.profileComplete = calcProfileStrength(user);

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