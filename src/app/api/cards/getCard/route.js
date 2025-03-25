import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Card } from '@/models/paymentSchema';
import encryption from '@/utils/encryption';

export async function POST(request) {
  try {
    await connectDB();
    const { userId } = await request.json();
   
    if (!userId) {
      return NextResponse.json(
        { error: "id is required" },
        { status: 400 }
      );
    }
   
    // Find all cards under provided ID
    async function findUserById(userId) {
        try {
          const card = await Card.findById(userId);
          return card;
        } catch (error) {
          throw new Error("Card not found");
        }
      }
    const card = await findUserById(userId);
    if (!card) {
        return NextResponse.json(
            { error: "card not found", success: false },
            { status: 401 }
        );
    }
    
    // Get encryption key from environment variables
    const encryptionKey = process.env.NEXT_PUBLIC_CARD_KEY;
    if (!encryptionKey) {
        throw new Error("Encryption key not found in environment variables");
    }
    
    // Create a new object with decrypted values
    const decryptedCard = {
      ...card._doc,  // Spread the Mongoose document properties
      cardNumber: encryption.decrypt(card.cardNumber, encryptionKey),
      expirationDate: encryption.decrypt(card.expirationDate, encryptionKey),
      cvv: encryption.decrypt(card.cvv, encryptionKey)
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