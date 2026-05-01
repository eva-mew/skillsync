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

const app = express();  // ← must come before any app.use()

connectDB();
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'https://skillsync.vercel.app',
    'https://skillsync-api-mci6.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/startups', startupRoutes);
app.use('/api/recommend', recommendRoutes);
app.use('/api/saved', savedRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/payment', paymentRoutes);  // ← once, in the right place

app.get('/', (req, res) => {
  res.json({ message: 'SkillSync API is running!', status: 'success' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
