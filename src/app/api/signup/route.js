import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

// Email configuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
    }
});

export async function POST(request) {
    try {
        await connectMongoDB();
       
        const { email, password } = await request.json();
       
        // Input validation
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                error: "email and password are required"
            }, { status: 400 });
        }
       
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({
                success: false,
                error: "email already exists"
            }, { status: 409 });
        }
       
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
       
        // Create new user with hashed password and verification token
        await User.create({
            email,
            password: hashedPassword,
            verified: false,
            verificationToken,
            verificationTokenExpires: tokenExpiration
        });

        // Create verification link
        const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/email/verify/${verificationToken}`;

        // Send verification email
        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Verify Your Email',
            html: `
                <h1>Email Verification</h1>
                <p>Please click the link below to verify your email address:</p>
                <a href="${verificationLink}">Verify Email</a>
                <p>This link will expire in 24 hours.</p>
            `
        });
       
        return NextResponse.json({
            success: true,
            message: "User created successfully! Please check your email for verification."
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to create user"
        }, { status: 500 });
    }
}