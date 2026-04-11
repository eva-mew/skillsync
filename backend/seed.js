const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Job = require('./models/Job');
const Startup = require('./models/Startup');

dotenv.config();

const jobs = [
  {
    title: "Full Stack Developer",
    company: "TechNova BD",
    description: "Build and maintain web applications using MERN stack",
    requiredSkills: ["React", "Node.js", "MongoDB", "Express"],
    location: "Dhaka",
    salary: "60,000",
    type: "full-time",
    workMode: "remote",
    experience: "fresher"
  },
  {
    title: "Frontend React Developer",
    company: "Pixel Studio",
    description: "Create beautiful UI components using React and Tailwind",
    requiredSkills: ["React", "JavaScript", "Tailwind", "CSS"],
    location: "Dhaka",
    salary: "45,000",
    type: "full-time",
    workMode: "hybrid",
    experience: "fresher"
  },
  {
    title: "Backend Node.js Developer",
    company: "CloudStack BD",
    description: "Build REST APIs and manage server infrastructure",
    requiredSkills: ["Node.js", "Express", "MongoDB", "REST API"],
    location: "Chittagong",
    salary: "70,000",
    type: "full-time",
    workMode: "onsite",
    experience: "junior"
  },
  {
    title: "MERN Stack Engineer",
    company: "GreenByte Labs",
    description: "Develop full stack applications from scratch",
    requiredSkills: ["React", "Node.js", "MongoDB", "Git"],
    location: "Remote",
    salary: "75,000",
    type: "full-time",
    workMode: "remote",
    experience: "fresher"
  },
  {
    title: "Junior Software Engineer",
    company: "StartupBD",
    description: "Work on exciting startup projects with modern tech",
    requiredSkills: ["JavaScript", "React", "MySQL"],
    location: "Dhaka",
    salary: "40,000",
    type: "full-time",
    workMode: "remote",
    experience: "fresher"
  },
  {
    title: "API Developer",
    company: "DataFlow Inc",
    description: "Design and build scalable REST APIs",
    requiredSkills: ["Node.js", "Express", "MongoDB", "Docker"],
    location: "Remote",
    salary: "70,000",
    type: "contract",
    workMode: "remote",
    experience: "junior"
  },
  {
    title: "React Native Developer",
    company: "AppFactory BD",
    description: "Build cross-platform mobile apps using React Native",
    requiredSkills: ["React", "React Native", "JavaScript"],
    location: "Dhaka",
    salary: "65,000",
    type: "full-time",
    workMode: "hybrid",
    experience: "junior"
  },
  {
    title: "UI/UX Developer",
    company: "DesignHub",
    description: "Create stunning user interfaces with modern design",
    requiredSkills: ["React", "CSS", "Figma", "Tailwind"],
    location: "Dhaka",
    salary: "50,000",
    type: "full-time",
    workMode: "onsite",
    experience: "fresher"
  },
  {
    title: "DevOps Engineer",
    company: "CloudMind BD",
    description: "Manage CI/CD pipelines and cloud infrastructure",
    requiredSkills: ["Docker", "AWS", "Linux", "Git"],
    location: "Remote",
    salary: "90,000",
    type: "full-time",
    workMode: "remote",
    experience: "mid"
  },
  {
    title: "Python Django Developer",
    company: "DataSoft",
    description: "Build web applications using Python and Django",
    requiredSkills: ["Python", "Django", "SQL", "REST API"],
    location: "Dhaka",
    salary: "55,000",
    type: "full-time",
    workMode: "onsite",
    experience: "junior"
  },
  {
    title: "WordPress Developer",
    company: "WebCraft BD",
    description: "Build and customize WordPress websites for clients",
    requiredSkills: ["WordPress", "PHP", "CSS", "JavaScript"],
    location: "Dhaka",
    salary: "35,000",
    type: "full-time",
    workMode: "hybrid",
    experience: "fresher"
  },
  {
    title: "Flutter Developer",
    company: "MobileFirst BD",
    description: "Build beautiful mobile apps using Flutter",
    requiredSkills: ["Flutter", "Dart", "Firebase"],
    location: "Dhaka",
    salary: "60,000",
    type: "full-time",
    workMode: "remote",
    experience: "junior"
  },
  {
    title: "Data Analyst",
    company: "InsightBD",
    description: "Analyze data and create reports for business decisions",
    requiredSkills: ["Python", "SQL", "Data Analysis", "Excel"],
    location: "Dhaka",
    salary: "55,000",
    type: "full-time",
    workMode: "hybrid",
    experience: "fresher"
  },
  {
    title: "Digital Marketing Developer",
    company: "MarketPro BD",
    description: "Build marketing tools and landing pages",
    requiredSkills: ["JavaScript", "React", "Digital Marketing", "SEO"],
    location: "Dhaka",
    salary: "40,000",
    type: "full-time",
    workMode: "remote",
    experience: "fresher"
  },
  {
    title: "Laravel PHP Developer",
    company: "CodeNest BD",
    description: "Build web applications using Laravel framework",
    requiredSkills: ["PHP", "Laravel", "MySQL", "REST API"],
    location: "Chittagong",
    salary: "50,000",
    type: "full-time",
    workMode: "onsite",
    experience: "junior"
  },
  {
    title: "TypeScript Developer",
    company: "TypeCraft",
    description: "Build enterprise applications using TypeScript",
    requiredSkills: ["TypeScript", "React", "Node.js", "SQL"],
    location: "Remote",
    salary: "80,000",
    type: "full-time",
    workMode: "remote",
    experience: "mid"
  },
  {
    title: "Junior Frontend Developer",
    company: "WebWave BD",
    description: "Build responsive websites for clients",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    location: "Dhaka",
    salary: "30,000",
    type: "full-time",
    workMode: "onsite",
    experience: "fresher"
  },
  {
    title: "Content Management Developer",
    company: "ContentBD",
    description: "Build and manage content management systems",
    requiredSkills: ["JavaScript", "Node.js", "MongoDB", "React"],
    location: "Dhaka",
    salary: "45,000",
    type: "full-time",
    workMode: "hybrid",
    experience: "fresher"
  },
  {
    title: "Software QA Engineer",
    company: "QualityFirst BD",
    description: "Test and ensure quality of software applications",
    requiredSkills: ["JavaScript", "Testing", "Selenium", "Git"],
    location: "Dhaka",
    salary: "45,000",
    type: "full-time",
    workMode: "hybrid",
    experience: "fresher"
  },
  {
    title: "Internship — Web Developer",
    company: "TechStart BD",
    description: "Learn and grow as a web developer in a startup",
    requiredSkills: ["HTML", "CSS", "JavaScript", "React"],
    location: "Dhaka",
    salary: "15,000",
    type: "internship",
    workMode: "onsite",
    experience: "fresher"
  }
];

const startups = [
  {
    title: "Online Tutoring Platform",
    description: "Connect students with tutors via video calls. Charge commission per session.",
    category: "education",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    budget: "zero",
    difficulty: "beginner",
    estimatedCost: "$0",
    potentialRevenue: "High",
    timeToLaunch: "4 weeks",
    viabilityScore: 92,
    roadmap: [
      "Define your niche — pick 2-3 subjects to start",
      "Build landing page with React — tutor signup and student booking",
      "Set up backend with Node.js + MongoDB for user management",
      "Integrate free video call API — Daily.co or Jitsi",
      "Add payment system — bKash or Stripe, charge 15% commission",
      "Soft launch — recruit 5 tutors from your university",
      "Collect feedback and improve the platform",
      "Market on Facebook groups and university WhatsApp groups"
    ],
    tags: ["education", "remote", "beginner-friendly"]
  },
  {
    title: "SaaS Job Board for Bangladesh",
    description: "A modern job board focused on Bangladesh tech jobs. Charge companies to post.",
    category: "tech",
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
    budget: "zero",
    difficulty: "beginner",
    estimatedCost: "$50",
    potentialRevenue: "High",
    timeToLaunch: "3 weeks",
    viabilityScore: 88,
    roadmap: [
      "Build core job posting and browsing functionality",
      "Add user roles — Job Seeker free, Company paid to post",
      "Create filterable job feed by skill, location, salary",
      "Add application tracking for companies",
      "Email notifications when application status changes",
      "Pricing — first post free, then charge per listing",
      "SEO optimize job pages for Google indexing",
      "Launch with 10 real job posts from companies you know"
    ],
    tags: ["tech", "saas", "jobs"]
  },
  {
    title: "Freelancer Marketplace BD",
    description: "A niche Fiverr for Bangladeshi freelancers. Take percentage of each transaction.",
    category: "tech",
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
    budget: "low",
    difficulty: "intermediate",
    estimatedCost: "$200",
    potentialRevenue: "Very High",
    timeToLaunch: "6 weeks",
    viabilityScore: 85,
    roadmap: [
      "Research niche — focus on one category to start fast",
      "Build freelancer and client account systems",
      "Create service listing system with pricing",
      "Build order management and delivery system",
      "Add real-time messaging with Socket.io",
      "Integrate payment with escrow system — take 10% fee",
      "Manually onboard 20 freelancers before launch",
      "Launch and market on Facebook and LinkedIn"
    ],
    tags: ["marketplace", "freelance", "tech"]
  },
  {
    title: "AI Resume Builder",
    description: "Help people build professional resumes with AI suggestions. Freemium model.",
    category: "tech",
    requiredSkills: ["React", "Node.js", "JavaScript"],
    budget: "low",
    difficulty: "intermediate",
    estimatedCost: "$100",
    potentialRevenue: "Medium",
    timeToLaunch: "5 weeks",
    viabilityScore: 79,
    roadmap: [
      "Build form-based resume builder with multiple sections",
      "Create 5 professional resume templates in React",
      "Add AI suggestion feature using OpenAI API",
      "PDF export using React-PDF library",
      "Freemium model — 1 template free, rest paid",
      "Add ATS score checker feature",
      "Build referral system for growth",
      "Market to university students and job seekers"
    ],
    tags: ["ai", "resume", "saas"]
  },
  {
    title: "Student Portfolio Platform",
    description: "Let CS students showcase projects and connect with recruiters.",
    category: "education",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    budget: "zero",
    difficulty: "beginner",
    estimatedCost: "$0",
    potentialRevenue: "Medium",
    timeToLaunch: "3 weeks",
    viabilityScore: 83,
    roadmap: [
      "Build profile creation with skills and project showcase",
      "Make profiles public with shareable URLs",
      "Add recruiter accounts to browse students",
      "Skill endorsement system between students",
      "Leaderboard of most viewed profiles",
      "Premium for recruiters to contact students directly",
      "Launch at your university first",
      "Expand to all BD engineering universities"
    ],
    tags: ["education", "portfolio", "students"]
  },
  {
    title: "E-learning Course Platform",
    description: "Sell online courses on tech topics. Keep 80% of revenue from each sale.",
    category: "education",
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
    budget: "zero",
    difficulty: "intermediate",
    estimatedCost: "$0",
    potentialRevenue: "Very High",
    timeToLaunch: "6 weeks",
    viabilityScore: 87,
    roadmap: [
      "Build course creation system for instructors",
      "Video hosting using YouTube unlisted or Cloudinary",
      "Student enrollment and progress tracking",
      "Payment integration for course purchases",
      "Certificate generation on course completion",
      "Review and rating system for courses",
      "Start with 3 courses you can teach yourself",
      "Market on social media and YouTube"
    ],
    tags: ["education", "elearning", "courses"]
  },
  {
    title: "Restaurant Menu & Order App",
    description: "Digital menu and ordering system for local BD restaurants. Monthly subscription.",
    category: "food",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    budget: "zero",
    difficulty: "beginner",
    estimatedCost: "$0",
    potentialRevenue: "Medium",
    timeToLaunch: "3 weeks",
    viabilityScore: 80,
    roadmap: [
      "Build digital menu display system for restaurants",
      "QR code generation for each restaurant table",
      "Online ordering system with status tracking",
      "Restaurant dashboard to manage orders",
      "Payment integration for online payments",
      "Monthly subscription model for restaurants",
      "Start with 3 local restaurants as pilot customers",
      "Expand through word of mouth among restaurant owners"
    ],
    tags: ["food", "restaurant", "local"]
  },
  {
    title: "Health & Fitness Tracker",
    description: "Track workouts, meals, and health goals. Premium subscription for advanced features.",
    category: "health",
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
    budget: "zero",
    difficulty: "intermediate",
    estimatedCost: "$0",
    potentialRevenue: "High",
    timeToLaunch: "5 weeks",
    viabilityScore: 76,
    roadmap: [
      "Build workout logging and tracking system",
      "Meal and calorie tracking with food database",
      "Goal setting and progress visualization with charts",
      "BMI calculator and health metrics dashboard",
      "Reminder notifications for workouts and meals",
      "Freemium model with premium analytics",
      "Partner with local gyms for user acquisition",
      "Market on fitness Facebook groups and Instagram"
    ],
    tags: ["health", "fitness", "wellness"]
  },
  {
    title: "Event Management Platform",
    description: "Create and manage events online. Sell tickets and manage attendees.",
    category: "tech",
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
    budget: "low",
    difficulty: "intermediate",
    estimatedCost: "$100",
    potentialRevenue: "High",
    timeToLaunch: "5 weeks",
    viabilityScore: 78,
    roadmap: [
      "Build event creation and management system",
      "Ticket purchasing and QR code generation",
      "Attendee management dashboard for organizers",
      "Payment integration for ticket sales",
      "Email confirmations and reminders",
      "Take 5% commission on each ticket sold",
      "Start with university and tech community events",
      "Market to event organizers in Dhaka"
    ],
    tags: ["events", "tickets", "management"]
  },
  {
    title: "Property Rental Platform BD",
    description: "Connect landlords with tenants in Bangladesh. Charge listing fees.",
    category: "real-estate",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    budget: "zero",
    difficulty: "beginner",
    estimatedCost: "$0",
    potentialRevenue: "High",
    timeToLaunch: "4 weeks",
    viabilityScore: 82,
    roadmap: [
      "Build property listing system with photos",
      "Search and filter by location, price, type",
      "Tenant inquiry and messaging system",
      "Landlord dashboard to manage listings",
      "Verified landlord badge system",
      "Charge per listing or monthly subscription",
      "Start with Dhaka and Chittagong properties",
      "Market through Facebook property groups"
    ],
    tags: ["real-estate", "rental", "property"]
  },
  {
    title: "Skill Exchange Platform",
    description: "People exchange skills with each other — teach what you know, learn what you need.",
    category: "education",
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
    budget: "zero",
    difficulty: "beginner",
    estimatedCost: "$0",
    potentialRevenue: "Medium",
    timeToLaunch: "4 weeks",
    viabilityScore: 74,
    roadmap: [
      "Build skill profile system — what you teach, what you want to learn",
      "Matching algorithm to connect complementary skills",
      "Session scheduling and video call integration",
      "Review and rating system after each session",
      "Credit system — earn credits by teaching, spend to learn",
      "Premium tier for professional skill exchange",
      "Launch in universities and tech communities",
      "Market on LinkedIn and Facebook"
    ],
    tags: ["education", "skills", "community"]
  },
  {
    title: "Local Service Booking App",
    description: "Book local services — plumbers, electricians, cleaners. Take commission per booking.",
    category: "services",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    budget: "zero",
    difficulty: "beginner",
    estimatedCost: "$0",
    potentialRevenue: "High",
    timeToLaunch: "4 weeks",
    viabilityScore: 81,
    roadmap: [
      "Build service provider registration system",
      "Service listing with pricing and availability",
      "Customer booking and payment system",
      "Real-time booking status tracking",
      "Review system for service providers",
      "Take 10-15% commission per completed booking",
      "Start with 10 verified service providers",
      "Market through Facebook and local community groups"
    ],
    tags: ["services", "local", "booking"]
  },
  {
    title: "Tech Community Forum BD",
    description: "Stack Overflow style Q&A for Bangladeshi developers. Monetize via job listings.",
    category: "tech",
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
    budget: "zero",
    difficulty: "intermediate",
    estimatedCost: "$0",
    potentialRevenue: "Medium",
    timeToLaunch: "4 weeks",
    viabilityScore: 71,
    roadmap: [
      "Build Q&A system with voting and accepted answers",
      "User reputation and badge system",
      "Tag system by technology for easy browsing",
      "Full-text search across all questions",
      "Job board integration for tech companies",
      "Email digest of top weekly questions",
      "Charge companies for featured job listings",
      "Partner with BD tech communities for launch"
    ],
    tags: ["community", "tech", "forum"]
  },
  {
    title: "Digital Product Marketplace",
    description: "Sell digital products — templates, UI kits, code snippets. Keep 80% of sales.",
    category: "tech",
    requiredSkills: ["React", "Node.js", "MongoDB", "JavaScript"],
    budget: "low",
    difficulty: "intermediate",
    estimatedCost: "$50",
    potentialRevenue: "High",
    timeToLaunch: "5 weeks",
    viabilityScore: 77,
    roadmap: [
      "Build product listing and digital download system",
      "Secure payment and instant download after purchase",
      "Seller dashboard with sales analytics",
      "Review and rating system for products",
      "Search and filter by category and price",
      "Take 20% commission on each sale",
      "Start by selling your own templates and UI kits",
      "Market to developers and designers on social media"
    ],
    tags: ["marketplace", "digital", "products"]
  },
  {
    title: "Mental Health & Mood Tracker",
    description: "Track daily mood and mental health. Connect with counselors online.",
    category: "health",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    budget: "zero",
    difficulty: "beginner",
    estimatedCost: "$0",
    potentialRevenue: "Medium",
    timeToLaunch: "3 weeks",
    viabilityScore: 75,
    roadmap: [
      "Build daily mood logging with emoji scale",
      "Mood history chart and pattern visualization",
      "Journaling feature for daily reflections",
      "Breathing and meditation exercise library",
      "Connect with certified counselors for sessions",
      "Anonymous community support groups",
      "Premium for counselor sessions and advanced analytics",
      "Partner with university counseling departments"
    ],
    tags: ["health", "mental-health", "wellness"]
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected');

    // Seed Jobs
    await Job.deleteMany({});
    await Job.insertMany(jobs);
    console.log(`✅ ${jobs.length} jobs seeded!`);

    // Seed Startups
    await Startup.deleteMany({});
    await Startup.insertMany(startups);
    console.log(`✅ ${startups.length} startups seeded!`);

    console.log('🎉 All data seeded successfully!');
    process.exit();
  } catch (error) {
    console.log('❌ Error:', error.message);
    process.exit(1);
  }
};

seedData();