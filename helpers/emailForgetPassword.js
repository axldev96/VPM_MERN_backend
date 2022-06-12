import nodemailer from 'nodemailer';

const emailForgetPassword = async (data) => {
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { name, email, token } = data;

  // send email
  const info = await transport.sendMail({
    from: `"VPM | Veterinary Patient Manager" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset your Password',
    text: 'Reset your Password on VPM',
    html: `<h1>Hello ${name}</h1>
    <p>You have requested to change your password</p>
    <p>Follow the link below to set a new password</p>
    <a href="${process.env.FRONTEND_URL}/forget-password/${token}">Change Password</a>
    <p>If you did not request this, please ignore this email</p>
    `,
  });

  console.log('Message sent: %s', info.messageId);
};

export default emailForgetPassword;
