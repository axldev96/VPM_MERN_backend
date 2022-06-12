import nodemailer from "nodemailer";

const emailRegister = async (data) => {
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
    subject: "Confirm your email",
    text: "Comfirm your account on VPM",
    html: `<h1>Hello ${name}</h1>
    <p>Please confirm your email by clicking the link below</p>
    <a href="${process.env.FRONTEND_URL}/confirm/${token}">Confirm Email</a>
    <p>If you did not request this, please ignore this email</p>
    `,
  });

  console.log("Message sent: %s", info.messageId);
};

export default emailRegister;
