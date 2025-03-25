import { NextResponse } from 'next/server';
import connectMongoDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import bcrypt from 'bcryptjs';


export async function PUT(request) {
    try {
        await connectMongoDB();
       
        const { email, password } = await request.json();
       
        // Input validation
        if (!email || !password) {
            return NextResponse.json({
                success: false,
                error: "credentials not valid"
            }, { status: 400 });
        }

        // Generate salt and hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.findOne({
            email: email,
        });


        // Update user password
        user.password = hashedPassword;
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