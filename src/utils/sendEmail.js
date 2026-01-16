import axios from 'axios';

export const sendEmail = async ({ to, subject, html }) => {
  const data = {
    sender: {
      name: "HabitFlow App",
      email: process.env.SMTP_USER
    },
    replyTo: {
      email: process.env.SMTP_USER,
      name: "HabitFlow Support"
    },
    to: [
      {
        email: to,
      },
    ],
    subject: subject,
    htmlContent: html,
  };

  try {
    await axios.post('https://api.brevo.com/v3/smtp/email', data, {
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'content-type': 'application/json',
        'accept': 'application/json'
      }
    });
    console.log("Email sent successfully via Brevo!");
  } catch (error) {
    console.error("Brevo Email Error:", error.response?.data || error.message);
    // Helpful log to see why it failed
    if (error.response?.status === 401) {
      console.error("Check your BREVO_API_KEY!");
    }
  }
};