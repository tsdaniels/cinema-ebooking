import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import { Profile } from '@/models/profileSchema';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_ADDRESS,
    pass: process.env.EMAIL_PASSWORD
  }
});

function generateTempPassword(length = 8) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?';
    const password = crypto.randomBytes(length)
        .map((byte) => charset[byte % charset.length])
        .join('');
    return password;
}

export async function POST(req) {
  try {
    await connectMongoDB();
    const { firstName, lastName, email, role } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email are required" }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 400 });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours

    // Generate a temporary password for the user
    const tempPassword = generateTempPassword(8); 

    // Hash the temporary password before saving to the database
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    // Create new user with the verification token and expiration
    const newUser = new User({
      email,
      role: role || 'User',
      verified: false, // Initially, the user is not verified
      verificationToken, // Store verification token
      verificationTokenExpires: tokenExpiration, // Store token expiration time
      password: hashedPassword,
    });

    // Create new profile
    const newProfile = new Profile({
        firstName,
        lastName,
        email,
        role: role || 'User',
    })

    // Save the new user
    await newUser.save();
    // Save the new profile
    await newProfile.save();

    // Send verification email
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
        <p>Your temporary password is: <strong>${tempPassword}</strong></p>
        <p>Please change your password once you've verified your email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: 'User created, temporary password sent, and verification email sent' }, { status: 200 });

  } catch (error) {
    console.error('Error creating user or sending verification email:', error);
    return NextResponse.json({ error: 'Failed to create user or send verification email' }, { status: 500 });
  }
}