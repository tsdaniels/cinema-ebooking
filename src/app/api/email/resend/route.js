import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { User } from '@/models/userSchema';
import connectDB from '@/libs/mongodb';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Resend verification endpoint
export async function POST(request) {
  try {
    await connectDB();
    
    const { email } = await request.json();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (user.verified) {
      return NextResponse.json(
        { error: 'Email already verified' },
        { status: 400 }
      );
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000;

    // Update user with new token
    user.verificationToken = verificationToken;
    user.verificationTokenExpires = tokenExpiration;
    await user.save();

    // Send new verification email
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/verify/${verificationToken}`;
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: 'Verify Your Email',
      html: `
        <h1>Email Verification</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationLink}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Verification email resent' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Resend verification error:', error);
    return NextResponse.json(
      { error: 'Failed to resend verification email. Please try again' },
      { status: 500 }
    );
  }
}