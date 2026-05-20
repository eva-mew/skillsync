const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const jobRoutes = require('./routes/jobRoutes');
const startupRoutes = require('./routes/startupRoutes');
const recommendRoutes = require('./routes/recommendRoutes');
const savedRoutes = require('./routes/savedRoutes');
const adminRoutes = require('./routes/adminRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const cron = require('node-cron');
const User = require('./models/User');
const { sendPremiumExpiryReminder } = require('./utils/emailService');

const app = express();  // ← must come before any app.use()
const contactRoutes = require('./routes/contactRoutes');
connectDB();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://skillsync-one-rho.vercel.app',
    'https://skillsync-api-mci6.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payment', paymentRoutes);  // ← once, in the right place
app.use('/api/contact', contactRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'SkillSync API is running!', status: 'success' });
});
// Run every day at 9 AM
cron.schedule('0 9 * * *', async () => {
  try {

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startOfTomorrow = new Date(
      tomorrow.setHours(0, 0, 0, 0)
    );

    const endOfTomorrow = new Date(
      tomorrow.setHours(23, 59, 59, 999)
    );

    const expiringUsers = await User.find({
      isPremium: true,
      premiumExpiresAt: {
        $gte: startOfTomorrow,
        $lte: endOfTomorrow
      }
    });

    for (const user of expiringUsers) {

      await sendPremiumExpiryReminder(
        user.email,
        user.name,
        user.premiumExpiresAt
      );

    }

    console.log(
      `✅ Expiry reminders sent to ${expiringUsers.length} users`
    );

  } catch (err) {

    console.error('Cron error:', err.message);

  }
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
