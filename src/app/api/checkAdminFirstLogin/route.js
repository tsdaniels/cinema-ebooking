// app/api/checkAdminFirstLogin/route.js

import { NextResponse } from 'next/server';
import { User } from '@/models/userSchema'; 

export async function POST(request) {
    const { email } = await request.json();

    try {
        // Find user by email
        const user = await User.findOne({ email });

        // Check if user exists and is an admin
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ firstLogin: false }, { status: 404 });
        }

        // Check if it's the user's first login
        return NextResponse.json({ firstLogin: user.isFirstLogin });
    } catch (error) {
        console.error("Error checking first login:", error);
        return NextResponse.json({ firstLogin: false }, { status: 500 });
    }
}
