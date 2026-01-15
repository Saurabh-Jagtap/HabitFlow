import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html }) => {
  // 1. Create Transporter
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
        rejectUnauthorized: false, // TEMPORARY: Helps bypass strict SSL checks for debugging
    },
    connectionTimeout: 10000, // 10 seconds (Fail faster so you don't wait forever)
    debug: true,  // <--- Shows SMTP traffic in logs
    logger: true  // <--- Logs info to console
  });

  // 2. Verify Connection (The Handshake)
  try {
      await transporter.verify();
      console.log("SMTP Connection Successful! Ready to send.");
  } catch (error) {
      console.error("SMTP Connection FAILED at handshake:", error);
      throw error; // Stop here if we can't connect
  }

  // 3. Send Email
  console.log(`Attempting to send email to ${to}...`);
  const info = await transporter.sendMail({
    from: `"HabitFlow Support" <${process.env.SMTP_USER}>`,
    to,
    subject,
    html,
  });

  console.log("Email sent info:", info.messageId);
};