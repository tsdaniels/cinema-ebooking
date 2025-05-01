import { NextResponse } from 'next/server';
import connectDB from '../../../libs/mongodb';
import { Profile } from '../../../models/profileSchema';

export async function PUT(request) {
    try {
      await connectDB();
      const { email, firstName, lastName, birthday, streetNumber, streetName, city, state, zipCode, promotions } = await request.json();
      
      // Create an object with only the non-undefined fields
      const updateFields = {};
      if (firstName !== undefined) updateFields.firstName = firstName;
      if (lastName !== undefined) updateFields.lastName = lastName;
      if (birthday !== undefined) updateFields.birthday = birthday;
      if (streetNumber !== undefined) updateFields.streetNumber = streetNumber;
      if (streetName !== undefined) updateFields.streetName = streetName;
      if (city !== undefined) updateFields.city = city;
      if (state !== undefined) updateFields.state = state;
      if (zipCode !== undefined) updateFields.zipCode = zipCode;
      if (promotions !== undefined) updateFields.promotions = promotions;
      
      const updatedProfile = await Profile.findOneAndUpdate(
        { email: email },
        updateFields,
        { new: true } // Return the updated document
      );
      
      if (!updatedProfile) {
        return NextResponse.json(
          { message: "Profile not found" },
          { status: 404 }
        );
      }
      
      return NextResponse.json(
        { message: "Profile updated successfully", profile: updatedProfile },
        { status: 200 }
      );
    } catch (error) {
      return NextResponse.json(
        { message: "Server error", error: error.message },
        { status: 500 }
      );
    }
  }