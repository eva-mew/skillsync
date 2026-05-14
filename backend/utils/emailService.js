const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY);

exports.sendApplicationConfirmation = async (userEmail, userName, jobTitle, company) => {
  try {
    await resend.emails.send({
      from: 'SkillSync <onboarding@resend.dev>',
      to: userEmail,
      subject: `✅ Application Submitted — ${jobTitle} at ${company}`,
      html: `<p>Hi <strong>${userName}</strong>, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.</p>`
    });
    console.log('✅ Confirmation email sent!');
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

exports.sendStatusUpdate = async (userEmail, userName, jobTitle, company, newStatus) => {
  try {
    await resend.emails.send({
      from: 'SkillSync <onboarding@resend.dev>',
      to: userEmail,
      subject: `📢 Application Update — ${jobTitle}`,
      html: `<p>Hi <strong>${userName}</strong>, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> status changed to <strong>${newStatus.toUpperCase()}</strong>.</p>`
    });
    console.log('✅ Status email sent!');
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

exports.sendJobPostedConfirmation = async (adminEmail, jobTitle, company) => {
  try {
    await resend.emails.send({
      from: 'SkillSync <onboarding@resend.dev>',
      to: adminEmail,
      subject: `✅ Job Posted — ${jobTitle} at ${company}`,
      html: `<p><strong>${jobTitle}</strong> at <strong>${company}</strong> is now live.</p>`
    });
  } catch (err) {
    console.error('Email error:', err.message);
  }
};