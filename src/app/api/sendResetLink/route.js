import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
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

export async function POST(req) {
    try {
        await connectMongoDB();

        const { email } = await req.json();
        
        if (!email) {
            return NextResponse.json({ success: false, error: "Email is required" }, { status: 400 });
        }

        // Find user with email address
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Generate password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = new Date(Date.now() + 3600000); // 1 hour expiration

        // Store token in database
        user.resetToken = resetToken;
        user.resetTokenExpires = resetTokenExpiration;
        await user.save();

        // Create reset password link
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/resetPasswordForm/${resetToken}`;

        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset</h2>
                <p>Click the link below to reset your password:</p>
                <a href=${resetLink}>Click here to reset your password</a>
                <p>This link will expire in 1 hour.</p>
            `
        });

        return NextResponse.json({ success: true, message: "Password reset link sent!" }, { status: 200 });

    } catch (error) {
        console.error("Error sending reset link:", error);
        return NextResponse.json({ success: false, error: "Failed to send reset email" }, { status: 500 });
    }
}
