import bcrypt from "bcryptjs";
import connectDB from "@/libs/mongodb";
import { User } from "@/models/userSchema";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await connectDB();
       
        const { token, newPassword } = await request.json();
       
        // Input validation
        if (!token || !newPassword) {
            return NextResponse.json({
                success: false,
                error: "token and new password are required"
            }, { status: 400 });
        }
       
        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        // Find user with token
        const user = await User.findOne({
            resetToken: token,
        });

        // Token is not associated with a user
        if (!user) {
            return NextResponse.json({
                success: false,
                error: "Invalid Token. Please try again."
            }, { status: 500 });
        }

        // Update user password and remove token information
        user.password = hashedPassword;
        user.resetToken = undefined;
        user.resetTokenExpires = undefined;
        await user.save();

       // Return success message
        return NextResponse.json({
            success: true,
            message: "Password updated successfully!"
        }, { status: 201 });
        
    } catch (error) {
        console.error("Error updating password:", error);
        return NextResponse.json({
            success: false,
            error: "Failed to update password"
        }, { status: 500 });
    }
}
