const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API_KEY || 'dummy_key');

exports.sendApplicationConfirmation = async (userEmail, userName, jobTitle, company) => {
  try {
    const result = await resend.emails.send({
      from: 'SkillSync <onboarding@resend.dev>',
      to: userEmail,
      subject: `✅ Application Submitted — ${jobTitle} at ${company}`,
      html: `<p>Hi <strong>${userName}</strong>, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.</p>`
    });
    console.log('✅ Confirmation result:', JSON.stringify(result));
  } catch (err) {
    console.error('Confirmation error:', err);
  }
};

exports.sendStatusUpdate = async (userEmail, userName, jobTitle, company, newStatus) => {
  try {
    const result = await resend.emails.send({
      from: 'SkillSync <onboarding@resend.dev>',
      to: userEmail,
      subject: `📢 Application Update — ${jobTitle}`,
      html: `<p>Hi <strong>${userName}</strong>, your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> status: <strong>${newStatus.toUpperCase()}</strong></p>`
    });
    console.log('✅ Status result:', JSON.stringify(result));
  } catch (err) {
    console.error('Status error:', err);
  }
};

exports.sendJobPostedConfirmation = async (adminEmail, jobTitle, company) => {
  try {
    const result = await resend.emails.send({
      from: 'SkillSync <onboarding@resend.dev>',
      to: adminEmail,
      subject: `✅ Job Posted — ${jobTitle} at ${company}`,
      html: `<p><strong>${jobTitle}</strong> at <strong>${company}</strong> is now live.</p>`
    });
    console.log('✅ Job posted result:', JSON.stringify(result));
  } catch (err) {
    console.error('Job posted error:', err);
  }
};