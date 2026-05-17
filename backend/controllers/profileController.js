const User = require('../models/User');

const calculateStrength = (user) => {
  let score = 0;

  // ── Skills — 40 points ──────────────────────────────────
  // More skills = more points (diminishing returns after 10)
  const skillCount = (user.skills || []).length;
  if      (skillCount >= 10) score += 40;
  else if (skillCount >= 7)  score += 34;
  else if (skillCount >= 5)  score += 28;
  else if (skillCount >= 3)  score += 20;
  else if (skillCount >= 1)  score += 12;
  // 0 skills = 0 points

  // ── Experience — 20 points (4 levels) ───────────────────
  const expPoints = {
    'senior':  20,  // most complete profile indicator
    'mid':     16,
    'junior':  12,
    'fresher': 8,   // still valid, lower weight
    '':        0,
  };
  score += expPoints[user.experience || ''] || 0;

  // ── Work Preference — 15 points (4 options) ─────────────
  const workPoints = {
    'remote':  15,  // specific = clearer profile
    'onsite':  15,
    'hybrid':  12,
    'any':     8,   // any = less defined preference
    '':        0,
  };
  score += workPoints[user.workPreference || ''] || 0;

  // ── Interests — 15 points ───────────────────────────────
  const interestCount = (user.interests || []).length;
  if      (interestCount >= 5) score += 15;
  else if (interestCount >= 3) score += 11;
  else if (interestCount >= 1) score += 6;

  // ── Budget — 5 points ───────────────────────────────────
  const budgetPoints = {
    'high':   5,
    'medium': 4,
    'low':    3,
    'zero':   2,
    '':       0,
  };
  score += budgetPoints[user.budget || ''] || 0;

  // ── Name + Email — 5 points (auto on registration) ──────
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