import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import { User } from "@/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(req, { params }) {
    await connectDB();
    
    const { token } = params; // Get token from URL params
    const { newPassword } = await req.json(); 

    if (!token || !newPassword) {
        return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    // Find user with reset token
    const user = await User.findOne({ resetToken: token });

    if (!user || user.resetTokenExpires < Date.now()) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
    }

    // Hash and update password
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetToken = undefined;
    user.resetTokenExpires = undefined;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
}
