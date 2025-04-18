import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import { Admin } from '@/models/adminSchema';
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';


export async function PUT(request) {
    try {
        await connectMongoDB();
       
        const { email, password, isAdmin } = await request.json();
       
        // Input validation
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                error: "credentials not valid"
            }, { status: 400 });
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.findOne({
            email: email,
        });

        let userOrAdmin;
        // Determine whether to look for a user or an admin
        if (isAdmin) {
            // If it's an admin password change, find the admin by email
            userOrAdmin = await Admin.findOne({ email });
            if (!userOrAdmin) {
                return NextResponse.json({
                    success: false,
                    error: "Admin not found"
                }, { status: 404 });
            }
        } else {
            // If it's a user password change, find the user by email
            userOrAdmin = await User.findOne({ email });
            if (!userOrAdmin) {
                return NextResponse.json({
                    success: false,
                    error: "User not found"
                }, { status: 404 });
            }
        }

        // Update password
        userOrAdmin.password = hashedPassword;
        await userOrAdmin.save();

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