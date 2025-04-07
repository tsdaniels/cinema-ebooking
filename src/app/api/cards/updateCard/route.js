import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Card } from '@/models/paymentSchema';
import encryption from '@/utils/encryption';
import nodemailer from 'nodemailer';

export async function PUT(request) {
  try {
    await connectDB();
    const { token, firstName, lastName, cardNumber, expirationDate, cvv, streetNumber, streetName, city, state, zipCode } = await request.json();
   
    if (!token) {
      return NextResponse.json(
        { error: "Card ID is required" },
        { status: 400 }
      );
    }
    
    // Encrypt sensitive card information if they're provided
    const updateData = {
      firstName,
      lastName,
      streetNumber,
      streetName,
      city,
      state,
      zipCode
    };
    
    // Only encrypt and update fields that are provided
    if (cardNumber) {
      updateData.cardNumber = encryption.encrypt(cardNumber.toString());
    }
    
    if (cvv) {
      updateData.cvv = encryption.encrypt(cvv.toString());
    }
    
    if (expirationDate) {
      updateData.expirationDate = expirationDate;
    }
   
    // Find and update the card
    const updatedCard = await Card.findByIdAndUpdate(
      token,
      updateData,
      { new: true } // Return the updated document
    );
   
    if (!updatedCard) {
      return NextResponse.json(
        { error: "Card not found", success: false },
        { status: 404 }
      );
    }
    
    // Decrypt sensitive information before sending the response
    const cardObj = updatedCard.toObject ? updatedCard.toObject() : updatedCard._doc;
    const decryptedCard = {
      ...cardObj,
      cardNumber: encryption.decrypt(cardObj.cardNumber),
      cvv: encryption.decrypt(cardObj.cvv)
    };

    
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
      { card: decryptedCard, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}