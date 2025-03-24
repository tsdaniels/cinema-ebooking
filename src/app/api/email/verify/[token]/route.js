import { NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import connectDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';

export async function GET(request, { params }) {
  try {
    await connectDB();
   
    const { token } = params;
    // Find user with the verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    console.log(user);

    if (!user) {
      // Redirect to error page
      return NextResponse.redirect(new URL('/verification/error', request.url));
    }

    // Update user verification status
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    // Redirect to success page
    return NextResponse.redirect(new URL('/verification/success', request.url));

  } catch (error) {
    console.error('Verification error:', error);
    // Redirect to error page
    return NextResponse.redirect(new URL('/verification/error', request.url));
  }
}