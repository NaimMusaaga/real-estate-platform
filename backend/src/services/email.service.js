const env = require('../config/env');

async function sendVerificationEmail(toEmail, token) {
  const verifyUrl = `${env.clientUrl}/verify-email?token=${token}`;

  if (env.email.mode !== 'mailtrap') {
    console.log(`[email:verification] To: ${toEmail}\nVerify your account: ${verifyUrl}`);
    return;
  }

  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: env.mailtrap.host,
    port: env.mailtrap.port,
    auth: { user: env.mailtrap.user, pass: env.mailtrap.pass },
  });
  await transporter.sendMail({
    from: 'no-reply@real-estate.local',
    to: toEmail,
    subject: 'Verify your email',
    text: `Verify your account: ${verifyUrl}`,
  });
}

module.exports = { sendVerificationEmail };
