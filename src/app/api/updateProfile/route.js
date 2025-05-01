// app/api/updateProfile/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema'; // Import User model
import jwt from 'jsonwebtoken';

export async function PUT(request) {
    try {
        await connectMongoDB();
        
        const { firstName, lastName } = await request.json();

        if (!firstName || !lastName) {
            return NextResponse.json({ success: false, message: "First name and last name are required" }, { status: 400 });
        }

        const token = request.cookies.get('auth_token'); // Get the auth token from cookies
        if (!token) {
            return NextResponse.json({ success: false, message: "Not authenticated" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Decode the JWT token
        const userId = decoded.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { firstName, lastName },
            { new: true } // Return the updated document
        );

        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Profile updated", user: user }, { status: 200 });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ success: false, error: "An error occurred during profile update" }, { status: 500 });
    }
}
