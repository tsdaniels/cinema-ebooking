import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../libs/mongodb';
import { Card } from '../../../../models/paymentSchema';
import encryption from '../../../../utils/encryption';

export async function POST(request) {
  try {
    await connectMongoDB();
    const { email } = await request.json();
   
    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }
   
    // Find all cards under provided email
    const cards = await Card.find({ email });
    
    
    // Decrypt all cards
    const decryptedCards = cards.map(card => {
      // Create a plain JavaScript object from the Mongoose document
      const cardObj = card.toObject ? card.toObject() : card._doc;
      
      // Return a new object with decrypted values
      return {
        ...cardObj,
        cardNumber: encryption.decrypt(cardObj.cardNumber),
        cvv: encryption.decrypt(cardObj.cvv)
      };
    });
   
    return NextResponse.json(
      { cards: decryptedCards },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}