// app/api/getUsers/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { Profile } from '@/models/profileSchema';

export async function GET() {
    try {
        await connectMongoDB();
        
        const users = await Profile.find({});
        return NextResponse.json({ success: true, users }, { status: 200 });
    } catch (error) {
        console.error("Error fetching user by email:", error);
        return NextResponse.json({ success: false, message: "Failed to fetch user" }, { status: 500 });
    }
}