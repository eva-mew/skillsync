const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.brevo.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendApplicationConfirmation = async (userEmail, userName, jobTitle, company) => {
  try {
    await transporter.sendMail({
      from: '"SkillSync" <sabiramahbubaevapeu@gmail.com>',
      to: userEmail,
      subject: `✅ Application Submitted — ${jobTitle} at ${company}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:#16a34a">Application Submitted!</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.</p>
        <p style="color:#6b7280">You'll be notified when the status changes.</p>
      </div>`
    });
    console.log('✅ Confirmation email sent to:', userEmail);
  } catch (err) {
    console.error('Confirmation email error:', err.message);
  }
};

exports.sendStatusUpdate = async (userEmail, userName, jobTitle, company, newStatus) => {
  const statusEmoji = { viewed:'👀', shortlisted:'🎉', rejected:'❌', pending:'⏳', selected:'🏆' };
  const statusColors = { viewed:'#2563eb', shortlisted:'#16a34a', rejected:'#dc2626', pending:'#d97706', selected:'#1a7a3a' };
  try {
    await transporter.sendMail({
      from: '"SkillSync" <sabiramahbubaevapeu@gmail.com>',
      to: userEmail,
      subject: `${statusEmoji[newStatus] || '📢'} Application Update — ${jobTitle}`,
      html: `<div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #e5e7eb;border-radius:12px">
        <h2 style="color:${statusColors[newStatus] || '#374151'}">Application Status Updated</h2>
        <p>Hi <strong>${userName}</strong>,</p>
        <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been updated:</p>
        <div style="padding:12px 20px;background:#f9fafb;border-radius:8px;margin:16px 0;border-left:4px solid ${statusColors[newStatus] || '#374151'}">
          <strong style="font-size:18px;color:${statusColors[newStatus] || '#374151'}">${statusEmoji[newStatus]} ${newStatus.toUpperCase()}</strong>
        </div>
      </div>`
    });
    console.log('✅ Status email sent to:', userEmail);
  } catch (err) {
    console.error('Status email error:', err.message);
  }
};

exports.sendJobPostedConfirmation = async (adminEmail, jobTitle, company) => {
  try {
    await transporter.sendMail({
      from: '"SkillSync" <sabiramahbubaevapeu@gmail.com>',
      to: adminEmail,
      subject: `✅ Job Posted — ${jobTitle} at ${company}`,
      html: `<p><strong>${jobTitle}</strong> at <strong>${company}</strong> is now live on SkillSync.</p>`
    });
  } catch (err) {
    console.error('Job posted email error:', err.message);
  }
};