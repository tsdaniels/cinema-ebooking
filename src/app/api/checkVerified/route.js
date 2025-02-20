// app/api/checkVerified/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';

export async function POST(request) {
    try {
        await connectMongoDB();
       
        const { email } = await request.json();
       
        // Only check verification status
        const user = await User.findOne({ email: email });
       
        if (!user) {
            return NextResponse.json({
                verified: false,
                exists: false,
                message: "User not found"
            });
        }

        return NextResponse.json({
            verified: user.verified,
            exists: true,
            message: user.verified ? "User is verified" : "User is not verified"
        });
       
    } catch (error) {
        console.error("Error checking verification status:", error);
        return NextResponse.json({
            error: "Error checking verification status"
        }, { status: 500 });
    }
}