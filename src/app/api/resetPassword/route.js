import bcrypt from "bcryptjs";
import connectDB from "@/libs/mongodb";
import { User } from "@/models/userSchema";
import { NextResponse } from "next/server";
import nodemailer from 'nodemailer';

export async function POST(request) {
    try {
        await connectDB();
       
        const { token, newPassword } = await request.json();
       
        // Input validation
        if (!token || !newPassword) {
            return NextResponse.json({
                success: false,
                error: "token and new password are required"
            }, { status: 400 });
        }
       
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Find user with token
        const user = await User.findOne({
            resetToken: token,
        });

        // Token is not associated with a user
        if (!user) {
            return NextResponse.json({
                success: false,
                error: "Invalid Token. Please try again."
            }, { status: 500 });
        }

        // Update user password and remove token information
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();


        // Set up email transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: email,
            subject: 'Password Changed!',
            html: `
                <h1>Your Password has been changed.</h1>
                <p style="font-size: 14px; color: #777;">If you did not make these changes or have any questions, please contact our support team.</p>
                <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Cinebook. All rights reserved.</p>
            `
            };

            await transporter.sendMail(mailOptions);

       // Return success message
        return NextResponse.json({
            success: true,
            message: "Password updated successfully!"
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to update password"
        }, { status: 500 });
    }
}
