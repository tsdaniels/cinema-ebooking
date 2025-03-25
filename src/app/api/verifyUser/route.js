// app/api/login/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import bcrypt from 'bcryptjs';

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
        
        // Find user by email
        const user = await User.findOne({ email });
        
        // Use generic error message to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Incorrect Password"
            }, { status: 401 });
        }

        // Compare password with stored hash
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return NextResponse.json({
                success: false,
                message: "Invalid Password"
            }, { status: 402 });
        }

        // Create response
        const response = NextResponse.json({
            success: true,
            message: "Password Accepted"
        }, { status: 200 });

        return response;
                
    } catch (error) {
        console.error("Error details:", error);
        return NextResponse.json({
            success: false,
            error: "An error occurred during verification"
        }, { status: 500 });
    }
}
