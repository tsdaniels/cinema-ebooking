import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { email, newProfileData } = req.body;

  // TODO: Update the user's profile in the database here

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    service: 'gmail', // Change if using another provider
    auth: {
      user: process.env.EMAIL_USER, // Set in .env.local
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Profile Updated',
    text: `Your profile has been updated successfully.\n\nNew Details:\n${JSON.stringify(
      newProfileData,
      null,
      2
    )}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Profile updated and email sent' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ message: 'Profile updated, but email failed' });
  }
}
