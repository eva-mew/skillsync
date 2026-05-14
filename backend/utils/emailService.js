require('dotenv').config(); 
const nodemailer = require('nodemailer');
console.log('EMAIL SERVICE LOADED');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ NOT SET');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Application submitted email → User
exports.sendApplicationConfirmation = async (userEmail, userName, jobTitle, company) => {
  try {
    await transporter.sendMail({
      from: `"SkillSync" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `✅ Application Submitted — ${jobTitle} at ${company}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#16a34a">Application Submitted!</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.</p>
          <p style="color:#6b7280">You'll be notified when the status changes.</p>
          <a href="${process.env.FRONTEND_URL}/my-applications" 
             style="display:inline-block;margin-top:16px;padding:10px 20px;background:#16a34a;color:white;border-radius:8px;text-decoration:none">
            View My Applications →
          </a>
          <p style="margin-top:24px;font-size:12px;color:#9ca3af">SkillSync — Skill-Based Career Platform</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

// Status changed email → User
exports.sendStatusUpdate = async (userEmail, userName, jobTitle, company, newStatus) => {
    console.log('📧 sendStatusUpdate called!');
  console.log('To:', userEmail);
  const statusColors = {
    viewed: '#2563eb',
    shortlisted: '#16a34a',
    rejected: '#dc2626',
    pending: '#d97706',
  };
  const statusEmoji = {
    viewed: '👀',
    shortlisted: '🎉',
    rejected: '❌',
    pending: '⏳',
  };
  try {
    await transporter.sendMail({
      from: `"SkillSync" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `${statusEmoji[newStatus] || '📢'} Application Update — ${jobTitle}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:${statusColors[newStatus] || '#374151'}">Application Status Updated</h2>
          <p>Hi <strong>${userName}</strong>,</p>
          <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been updated:</p>
          <div style="padding:12px 20px;background:#f9fafb;border-radius:8px;margin:16px 0;border-left:4px solid ${statusColors[newStatus] || '#374151'}">
            <strong style="font-size:18px;color:${statusColors[newStatus] || '#374151'}">${statusEmoji[newStatus]} ${newStatus.toUpperCase()}</strong>
          </div>
          <a href="${process.env.FRONTEND_URL}/my-applications"
             style="display:inline-block;padding:10px 20px;background:#1d4ed8;color:white;border-radius:8px;text-decoration:none">
            View Application →
          </a>
          <p style="margin-top:24px;font-size:12px;color:#9ca3af">SkillSync — Skill-Based Career Platform</p>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

// New job posted email → Admin confirmation
exports.sendJobPostedConfirmation = async (adminEmail, jobTitle, company) => {
  try {
    await transporter.sendMail({
      from: `"SkillSync" <${process.env.EMAIL_USER}>`,
      to: adminEmail,
      subject: `✅ Job Posted — ${jobTitle} at ${company}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
          <h2 style="color:#1d4ed8">Job Posted Successfully</h2>
          <p><strong>${jobTitle}</strong> at <strong>${company}</strong> is now live on SkillSync.</p>
          <a href="${process.env.FRONTEND_URL}/admin"
             style="display:inline-block;margin-top:16px;padding:10px 20px;background:#1d4ed8;color:white;border-radius:8px;text-decoration:none">
            View Admin Panel →
          </a>
        </div>
      `,
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};