import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { Admin } from '@/models/adminSchema'; 
import bcrypt from 'bcryptjs'; 
import jwt from 'jsonwebtoken';

if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
}

export async function POST(request) {
    try {
        await connectMongoDB();

        const { email, password } = await request.json();
        // Validate input
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                message: "email and password are required"
            }, { status: 400 });
        }
        
        // Find admin by email
        const admin = await Admin.findOne({ email });
        
        // Use generic error message to prevent email enumeration
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // Compare password with stored hash
        const isValidPassword = await bcrypt.compare(password, admin.password);
        
        if (!isValidPassword) {
            return NextResponse.json({
                success: false,
                message: "Invalid credentials"
            }, { status: 401 });
        }

        // Generate JWT token
        const token = jwt.sign(
            { email: admin.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Login successful"
        }, { status: 200 });

        // Set cookie
        response.cookies.set({
            name: "auth_token",
            value: token,
            httpOnly: true,
        });

        return response;
                
    } catch (error) {
        console.error("Error details:", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred during login"
        }, { status: 500 });
    }
}