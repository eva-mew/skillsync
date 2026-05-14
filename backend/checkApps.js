require('dotenv').config();
const mongoose = require('mongoose');
const Application = require('./models/Application');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const apps = await Application.find()
    .select('_id applicantName applicantEmail userId status')
    .limit(5);
  console.log(JSON.stringify(apps, null, 2));
  mongoose.disconnect();
});