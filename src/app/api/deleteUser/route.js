// app/api/deleteUser/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';

export async function DELETE(req) {
    try {
        await connectMongoDB();
        const { id } = await req.json();

        if (!id) {
            return NextResponse.json({ success: false, message: "User ID is required" }, { status: 400 });
        }

        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "User deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ success: false, message: "Failed to delete user" }, { status: 500 });
    }
}