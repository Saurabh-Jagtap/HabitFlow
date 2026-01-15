import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, 
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    tls: {
        ciphers: "SSLv3",
    },
    family: 4, // Forces IPv4
  });

  await transporter.sendMail({
    from: `"HabitFlow Support" <${process.env.SMTP_USER}>`, 
    to,
    subject,
    html,
  });
};