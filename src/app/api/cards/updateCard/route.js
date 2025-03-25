import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Card } from '@/models/paymentSchema';
import encryption from '@/utils/encryption';

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