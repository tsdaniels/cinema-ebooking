import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { Admin } from '@/models/adminSchema';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

// Function to generate a random password
function generateRandomPassword(length = 8) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

async function sendEmail(email, password) {
    const transporter = nodemailer.createTransport({
        service: 'gmail', 
        auth: {
            user: process.env.EMAIL_ADDRESS, 
            pass: process.env.EMAIL_PASSWORD, 
        },
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Your Temporary Admin Password',
        text: `Hello,\n\nYour temporary admin password is: ${password}\n\nPlease change it as soon as possible.`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error('Error sending email');
    }
}

export async function POST(request) {
    try {
        await connectMongoDB();

        const { email, role = 'admin' } = await request.json();  

        // Validate email input
        if (!email) {
            return NextResponse.json({
                success: false,
                message: "Email is required"
            }, { status: 400 });
        }

        // Check if the admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({
                success: false,
                message: "Admin already exists"
            }, { status: 400 });
        }

        // Generate a random password
        const tempPassword = generateRandomPassword();

        // Hash the generated password
        const hashedPassword = await bcrypt.hash(tempPassword, 10);

        // Create new admin
        const newAdmin = new Admin({
            email,
            password: hashedPassword,
            role,
        });

        await newAdmin.save();

        // Send email with the temporary password
        await sendEmail(email, tempPassword);

        return NextResponse.json({
            success: true,
            message: "Admin created successfully. A temporary password has been sent to the admin's email."
        }, { status: 200 });
    } catch (error) {
        console.error("Error details:", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred during registration"
        }, { status: 500 });
    }
}