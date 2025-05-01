// File: app/api/fetchProfile/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../libs/mongodb';
import { Profile } from '../../../models/profileSchema';

export async function POST(request) {
    try {
      await connectDB();
      const { email } = await request.json();
     
      const profile = await Profile.findOne({ email: email });
      
      if (!profile) {
        return NextResponse.json(
          { message: "Profile not found" },
          { status: 404 }
        );
      }
     
      return NextResponse.json(
        { message: "Profile found", profile },
        { status: 200 }  // Note: 200 is more appropriate than 201 for a GET-like operation
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Server error", error: error.message },
        { status: 500 }
      );
    }
  }