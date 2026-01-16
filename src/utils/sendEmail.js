import axios from 'axios';

export const sendEmail = async ({ to, subject, text }) => {

  const data = {
    service_id: process.env.EMAILJS_SERVICE_ID,
    template_id: process.env.EMAILJS_TEMPLATE_ID,
    user_id: process.env.EMAILJS_PUBLIC_KEY,
    accessToken: process.env.EMAILJS_PRIVATE_KEY,
    template_params: {
      email: to,           // Maps to {{email}} in "To Email" setting & Template body
      link: text,          // Maps backend 'resetUrl' to {{link}} in Template
      company: "HabitFlow",// Maps to [Company Name] in your template
    },
  };

  try {
    await axios.post('https://api.emailjs.com/api/v1.0/email/send', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log("Email sent successfully via EmailJS!");
  } catch (error) {
    console.error("EmailJS Error:", error.response?.data || error.message);
  }
};