const Job = require('../models/Job');
const Startup = require('../models/Startup');
const User = require('../models/User');

// =========================
// HELPER: normalize text
// =========================
const normalize = (str = '') =>
  str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();


// =========================
// JOB MATCH SCORE
// =========================
const getJobMatchScore = (user, job) => {
  let score = 0;

  const userSkills = (user.skills || []).map(s => normalize(s));
  const jobSkills = job.requiredSkills || [];

  // Skill match — 70 points
  if (jobSkills.length > 0) {
    const matched = jobSkills.filter(skill =>
      userSkills.includes(normalize(skill))
    ).length;

    score += (matched / jobSkills.length) * 70;
  }

  // Work mode match — 20 points
  if (
    user.workPreference === job.workMode ||
    user.workPreference === 'any'
  ) {
    score += 20;
  }

  // Experience match — 10 points
  if (user.experience === job.experience) {
    score += 10;
  }

  return Math.round(score);
};


// =========================
// STARTUP MATCH SCORE
// =========================
const getStartupMatchScore = (user, startup) => {
  let score = 0;

  const userSkills = (user.skills || []).map(s => normalize(s));
  const userInterests = (user.interests || []).map(i => normalize(i));

  const startupSkills = (startup.requiredSkills || []).map(s => normalize(s));
  const startupTags = (startup.tags || []).map(t => normalize(t));
  const startupCategory = normalize(startup.category);

  // =========================
  // 1. Skill match (40)
  // =========================
  const skillMatched = startupSkills.filter(skill =>
    userSkills.includes(skill)
  ).length;

  if (startupSkills.length > 0) {
    score += (skillMatched / startupSkills.length) * 40;
  }

  // =========================
  // 2. Interest match (40)
  // =========================
  const allStartupTopics = [
    ...startupTags,
    startupCategory
  ].filter(Boolean);

  const interestMatched = allStartupTopics.some(topic =>
    userInterests.some(userInterest =>
      topic.includes(userInterest) ||
      userInterest.includes(topic)
    )
  );

  if (interestMatched) {
    score += 40;
  }

  // =========================
  // 3. Budget match (20)
  // =========================
  if (
    startup.budget === user.budget ||
    user.budget === 'high'
  ) {
    score += 20;
  }

  return Math.round(score);
};


// =========================
// GET RECOMMENDED JOBS
// =========================
const getRecommendedJobs = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.skills || user.skills.length === 0) {
      return res.status(400).json({
        message: 'Please complete your profile first'
      });
    }

    const jobs = await Job.find({});

    const scored = jobs.map(job => {
      const jobObj = job.toObject();

      const matched = (job.requiredSkills || []).filter(skill =>
        (user.skills || [])
          .map(s => normalize(s))
          .includes(normalize(skill))
      );

      const matchScore = getJobMatchScore(user, job);

      return {
        ...jobObj,
        matchScore,
        matchedSkills: matched,
        locked: job.isPremium && !user.isPremium
      };
    });

    const sorted = scored.sort((a, b) => b.matchScore - a.matchScore);

    res.json(sorted);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


// =========================
// GET RECOMMENDED STARTUPS
// =========================
const getRecommendedStartups = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const startups = await Startup.find({});

    console.log('Total startups:', startups.length);

    const scoredStartups = startups.map(startup => {
      const matchScore = getStartupMatchScore(user, startup);

      console.log({
        userInterests: user.interests,
        startupCategory: startup.category,
        startupTags: startup.tags,
        matchScore
      });

      return {
        ...startup.toObject(),
        matchScore,

        matchedSkills: (startup.requiredSkills || []).filter(skill =>
          (user.skills || [])
            .map(s => normalize(s))
            .includes(normalize(skill))
        )
      };
    });

    const sorted = scoredStartups.sort(
      (a, b) => b.matchScore - a.matchScore
    );

    res.json(sorted);

  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};


module.exports = {
  getRecommendedJobs,
  getRecommendedStartups
};