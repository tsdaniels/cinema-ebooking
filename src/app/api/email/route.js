import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
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

// Register endpoint
export async function POST(request) {
  try {
    await connectDB();
    
    const { email, password } = await request.json();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      verified: false,
      verificationToken,
      verificationTokenExpires: tokenExpiration
    });

    await newUser.save();

    // Create verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${verificationToken}`;
    console.log(verificationLink);

    // Send verification email
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

    return NextResponse.json({
      message: 'Registration successful. Please check your email for verification.'
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Registration failed' },
      { status: 500 }
    );
  }
}
