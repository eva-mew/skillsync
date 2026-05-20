const User = require('../models/User');

const calculateStrength = (user) => {
  const type = user.onboardingType || 'both';
  let score = 0;

  if (type === 'job') {
    // Job only — skills + experience + workPreference = 100
    const skillCount = (user.skills || []).length;
    if      (skillCount >= 10) score += 55;
    else if (skillCount >= 7)  score += 45;
    else if (skillCount >= 5)  score += 35;
    else if (skillCount >= 3)  score += 25;
    else if (skillCount >= 1)  score += 15;

    const expPoints = { senior: 25, mid: 20, junior: 15, fresher: 10, '': 0 };
    score += expPoints[user.experience || ''] || 0;

    const workPoints = { remote: 15, onsite: 15, hybrid: 12, any: 8, '': 0 };
    score += workPoints[user.workPreference || ''] || 0;

    if (user.name && user.email) score += 5;

  } else if (type === 'startup') {
    // Startup only — interests + budget + skills = 100
    const interestCount = (user.interests || []).length;
    if      (interestCount >= 5) score += 40;
    else if (interestCount >= 3) score += 28;
    else if (interestCount >= 1) score += 15;

    const budgetPoints = { high: 25, medium: 20, low: 15, zero: 10, '': 0 };
    score += budgetPoints[user.budget || ''] || 0;

    const skillCount = (user.skills || []).length;
    if      (skillCount >= 5) score += 20;
    else if (skillCount >= 3) score += 14;
    else if (skillCount >= 1) score += 8;

    if (user.name && user.email) score += 5;
    if (user.experience && user.experience !== '') score += 10;

  } else {
    // Both — original logic
    const skillCount = (user.skills || []).length;
    if      (skillCount >= 10) score += 40;
    else if (skillCount >= 7)  score += 34;
    else if (skillCount >= 5)  score += 28;
    else if (skillCount >= 3)  score += 20;
    else if (skillCount >= 1)  score += 12;

    const expPoints = { senior: 20, mid: 16, junior: 12, fresher: 8, '': 0 };
    score += expPoints[user.experience || ''] || 0;

    const workPoints = { remote: 15, onsite: 15, hybrid: 12, any: 8, '': 0 };
    score += workPoints[user.workPreference || ''] || 0;

    const interestCount = (user.interests || []).length;
    if      (interestCount >= 5) score += 15;
    else if (interestCount >= 3) score += 11;
    else if (interestCount >= 1) score += 6;

    const budgetPoints = { high: 5, medium: 4, low: 3, zero: 2, '': 0 };
    score += budgetPoints[user.budget || ''] || 0;

    if (user.name && user.email) score += 5;
  }

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
    if (req.body.onboardingType) user.onboardingType = req.body.onboardingType;

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