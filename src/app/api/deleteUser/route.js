// app/api/deleteUser/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import { Profile } from '@/models/profileSchema';

export async function DELETE(req) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json({ success: false, message: "Email is required" }, { status: 400 });
        }

        await connectMongoDB();

        // Find the user by email and delete them
        const deletedUser = await User.findOneAndDelete({ email });
        if (!deletedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        // Also delete the corresponding profile
        const deletedProfile = await Profile.findOneAndDelete({ email }); 
        if (!deletedProfile) {
            return NextResponse.json({ success: false, message: "User profile not found" }, { status: 404 });
        }

        // Return success response
        return NextResponse.json({ success: true, message: "User and profile deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
    }
}
