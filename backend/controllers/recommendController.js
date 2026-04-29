const Job = require('../models/Job');
const Startup = require('../models/Startup');
const User = require('../models/User');

// MATCH SCORE ALGORITHM
const getJobMatchScore = (user, job) => {
  let score = 0;

  // Skill match — 70 points
  if (job.requiredSkills.length > 0) {
    const matched = job.requiredSkills
      .filter(skill => user.skills
      .map(s => s.toLowerCase())
      .includes(skill.toLowerCase())).length;
    score += (matched / job.requiredSkills.length) * 70;
  }

  // Work mode match — 20 points
  if (user.workPreference === job.workMode ||
      user.workPreference === 'any') {
    score += 20;
  }

  // Experience match — 10 points
  if (user.experience === job.experience) {
    score += 10;
  }

  return Math.round(score);
};

const getStartupMatchScore = (user, startup) => {
  let score = 0;

  // Skill match — 40 points
  if (startup.requiredSkills.length > 0) {
    const matched = startup.requiredSkills
      .filter(skill => user.skills
      .map(s => s.toLowerCase())
      .includes(skill.toLowerCase())).length;
    score += (matched / startup.requiredSkills.length) * 40;
  }

  // Interest/category match — 30 points
  if (user.interests
      .map(i => i.toLowerCase())
      .includes(startup.category?.toLowerCase())) {
    score += 30;
  }

  // Budget match — 30 points
  if (startup.budget === user.budget || user.budget === 'high') {
    score += 30;
  }

  return Math.round(score);
};

const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({ message: 'Please complete your profile first' });
    }

    // Get ALL jobs including premium
    const jobs = await Job.find({});

    const scored = jobs.map(job => {
      const jobObj = job.toObject();
      const required = job.requiredSkills || [];
      const matched = required.filter(s => user.skills.includes(s));

      const skillScore = required.length > 0 ? (matched.length / required.length) * 70 : 0;
      const modeScore = user.workPreference === job.workMode ? 20 : 0;
      const expScore = user.experience === job.experience ? 10 : 0;
      const matchScore = Math.round(skillScore + modeScore + expScore);

      // Premium jobs visible to ALL but marked as locked for non-premium
      if (job.isPremium && !user.isPremium) {
        return {
          ...jobObj,
          matchScore,
          matchedSkills: matched,
          locked: true  // frontend uses this to show upgrade button
        };
      }

      return {
        ...jobObj,
        matchScore,
        matchedSkills: matched,
        locked: false
      };
    });

    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);
    res.json(sorted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
// @route  GET /api/recommend/startups
// @access Private
const getRecommendedStartups = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        message: 'Please complete your profile first to get recommendations'
      });
    }

    const startups = await Startup.find({});

    // Score all startups
    const scoredStartups = startups.map(startup => ({
      ...startup._doc,
      matchScore: getStartupMatchScore(user, startup),
      matchedSkills: startup.requiredSkills.filter(skill =>
        user.skills.map(s => s.toLowerCase())
        .includes(skill.toLowerCase()))
    }));

    // Sort by score — highest first
    const sorted = scoredStartups
      .sort((a, b) => b.matchScore - a.matchScore);

    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getRecommendedJobs, getRecommendedStartups };