// app/api/checkEmail/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';

export async function POST(request) {
    try {
        await connectMongoDB();
        
        const { email } = await request.json();
        
        // Check if email exists in database
        const existingUser = await User.findOne({ email: email });
        
        return NextResponse.json({
            exists: !!existingUser // converts to boolean and returns true if user exists
        });
        
    } catch (error) {
        console.error("Error checking email:", error);
        return NextResponse.json({
            error: "Error checking email availability"
        }, { status: 500 });
    }
}