import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';

export async function POST(request) {
  try {
    await connectDB();
   
    const { token } = await request.json();

    // Find user with the verification token
    const tokenExists = await User.findOne({
      resetToken: token,
    });

    // Ensure token is not expired
    const tokenNotExpired = await User.findOne({
      resetTokenExpires: { $gt: Date.now() }
    })

    //Return information
    return NextResponse.json({
        exists: !!tokenExists,
        notExpired: !!tokenNotExpired
    });

  } catch (error) {
    console.error('Password Reset error:', error);
    // Redirect to error page
    return NextResponse.redirect(new URL('/resetPasswordForm/error', request.url));
  }
}