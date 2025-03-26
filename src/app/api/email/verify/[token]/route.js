import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { User } from '@/models/userSchema';
import { Profile } from '@/models/profileSchema';

export async function GET(request, { params }) {
  try {
    await connectDB();
   
    const { token } = params;
    // Find user with the verification token
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
      // Redirect to error page
      return NextResponse.redirect(new URL('/verification/error', request.url));
    }

    const promotions = user.promotions;

    // Update user verification status
    user.verified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    user.promotions = undefined;
    await user.save();

    const existingProfile = await Profile.findOne({ email: user.email });
    
    if (!existingProfile) {
      // Create new profile
      const newProfile = new Profile({
        email: user.email,
        promotions: promotions
      });
      
      await newProfile.save();
    }

    // Redirect to success page
    return NextResponse.redirect(new URL('/verification/success', request.url));

  } catch (error) {
    console.error('Verification error:', error);
    // Redirect to error page
    return NextResponse.redirect(new URL('/verification/error', request.url));
  }
}