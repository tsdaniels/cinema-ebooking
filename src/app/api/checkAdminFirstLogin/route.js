// api/checkAdminFirstLogin/route.js
import { NextResponse } from 'next/server';
import { Admin } from '@/models/adminSchema';

export async function POST(request) {
    try {
        const { email } = await request.json();
        
        // Check if admin exists in the database
        const admin = await Admin.findOne({ email });
        
        if (!admin) {
            return NextResponse.json({
                success: false,
                message: "Admin not found"
            }, { status: 404 });
        }

        if (admin.isFirstLogin) {
          admin.isFirstLogin = false;
          await admin.save(); 
        }

        return NextResponse.json({
            firstLogin: admin.isFirstLogin  // Return the firstLogin status
        });
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({
            success: false,
            message: "An error occurred while checking first login"
        }, { status: 500 });
    }
}