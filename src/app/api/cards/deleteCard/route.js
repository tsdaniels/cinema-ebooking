import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Card } from '@/models/paymentSchema';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    await connectDB();
    const { email, cardId } = await request.json();
    
    if (!email || !cardId) {
      return NextResponse.json(
        { error: "Email and card ID are required" },
        { status: 400 }
      );
    }
    
    // Find and delete the card
    const result = await Card.findOneAndDelete({ 
      _id: cardId,
      email: email // Security check to ensure user owns the card
    });
    
    if (!result) {
      return NextResponse.json(
        { error: "Card not found or you don't have permission to delete it" },
        { status: 404 }
      );
    }

    // Set up email transport
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
        },
    });
  
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'One of your payment options has been changed!',
        html: `
          <h1>One of your payment options has been changed.</h1>
          <p style="font-size: 20px; color: #777;">If you did not make these changes or have any questions, please contact our support team.</p>
          <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #999;">© ${new Date().getFullYear()} Cinebook. All rights reserved.</p>
        `
      };
  
      await transporter.sendMail(mailOptions);
    
    return NextResponse.json(
      { message: "Card deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}