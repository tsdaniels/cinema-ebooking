import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Card } from '@/models/paymentSchema';

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
   
    // Find and update the card
    const updatedCard = await Card.findByIdAndUpdate(
      token,
      {
        firstName,
        lastName,
        cardNumber,
        expirationDate,
        cvv,
        streetNumber,
        streetName,
        city,
        state,
        zipCode
      },
      { new: true } // Return the updated document
    );
    
    if (!updatedCard) {
      return NextResponse.json(
        { error: "Card not found", success: false },
        { status: 404 }
      );
    }
   
    return NextResponse.json(
      { card: updatedCard, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}