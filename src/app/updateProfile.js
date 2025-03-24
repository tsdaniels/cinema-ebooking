import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const { newProfileData } = await request.json(); // Get updated profile data from request
    const token = request.cookies.get('auth_token'); // Get the JWT token from cookies

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: 'User not authenticated',
        },
        { status: 401 }
      );
    }

    // Decode the token to get the user's email
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const email = decoded.email;

    // Send email notification about the profile update
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Or another email provider
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Profile Has Been Updated',
      text: `Hello, your profile has been successfully updated.\n\nNew details:\n${JSON.stringify(
        newProfileData,
        null,
        2
      )}`,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({
      success: true,
      message: 'Profile updated and email sent',
    });
  } catch (error) {
    console.error('Error during profile update:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error updating profile or sending email',
      },
      { status: 500 }
    );
  }
}
