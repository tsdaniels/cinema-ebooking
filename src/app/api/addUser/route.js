import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';

export async function POST(req) {
    try {
        await connectMongoDB();
        const { firstName, lastName, email, role } = await req.json();

        if (!email || !firstName) {
            return NextResponse.json({ success: false, message: "First name and email are required" }, { status: 400 });
        }

        const newUser = new User({
            firstName,
            lastName,
            email,
            role: role || "User",
        });

        await newUser.save();
        return NextResponse.json({ success: true, user: newUser }, { status: 201 });
    } catch (error) {
        console.error("Error adding user:", error);
        return NextResponse.json({ success: false, message: "Failed to add user" }, { status: 500 });
    }
}
