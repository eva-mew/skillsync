const axios = require('axios');

const sendEmail = async (to, subject, html) => {
  await axios.post('https://api.brevo.com/v3/smtp/email', {
    sender: { name: 'SkillSync', email: 'sabiramahbubaevapeu@gmail.com' },
    to: [{ email: to }],
    subject,
    htmlContent: html
  }, {
    headers: {
      'api-key': process.env.BREVO_API_KEY,
      'Content-Type': 'application/json'
    }
  });
};

exports.sendApplicationConfirmation = async (userEmail, userName, jobTitle, company) => {
  try {
    await sendEmail(userEmail, `✅ Application Submitted — ${jobTitle} at ${company}`,
      `<p>Hi <strong>${userName}</strong>, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.</p>`
    );
    console.log('✅ Confirmation email sent to:', userEmail);
  } catch (err) { console.error('Email error:', err.response?.data || err.message); }
};

exports.sendStatusUpdate = async (userEmail, userName, jobTitle, company, newStatus) => {
  const emoji = { viewed:'👀', shortlisted:'🎉', rejected:'❌', pending:'⏳', selected:'🏆' };
  try {
    await sendEmail(userEmail, `${emoji[newStatus]||'📢'} Application Update — ${jobTitle}`,
      `<p>Hi <strong>${userName}</strong>, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> status: <strong>${newStatus.toUpperCase()}</strong></p>`
    );
    console.log('✅ Status email sent to:', userEmail);
  } catch (err) { console.error('Email error:', err.response?.data || err.message); }
};

exports.sendJobPostedConfirmation = async (adminEmail, jobTitle, company) => {
  try {
    await sendEmail(adminEmail, `✅ Job Posted — ${jobTitle} at ${company}`,
      `<p><strong>${jobTitle}</strong> at <strong>${company}</strong> is now live.</p>`
    );
  } catch (err) { console.error('Email error:', err.response?.data || err.message); }
};