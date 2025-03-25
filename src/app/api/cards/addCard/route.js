import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Card } from '@/models/paymentSchema';
import encryption from '@/utils/encryption';

export async function POST(request) {
    try {
        await connectDB();
        const { email, firstName, lastName, cardNumber, expirationDate, cvv, streetNumber, streetName, city, state, zipCode } = await request.json();
        
        // Get encryption key from environment variables
        const encryptionKey = process.env.NEXT_PUBLIC_CARD_KEY;
        if (!encryptionKey) {
            throw new Error("Encryption key not found in environment variables");
        }
        
        // Find all cards under provided email
        const cards = await Card.find({ email: email });
        if (cards.length >= 4) {
            return NextResponse.json(
                {error: "A user may only have a max of 4 cards. Please delete one if you would like to add a new card."},
                {status: 401}
            );
        }
        
        // Encrypt sensitive card information
        const encryptedCardNumber = encryption.encrypt(cardNumber.toString(), encryptionKey);
        const encryptedCVV = encryption.encrypt(cvv.toString(), encryptionKey);
        
        // Create new card with encrypted information
        await Card.create({
            email,
            firstName,
            lastName,
            cardNumber: encryptedCardNumber,
            expirationDate,
            cvv: encryptedCVV,
            streetNumber,
            streetName,
            city,
            state,
            zipCode
        });
     
        return NextResponse.json(
            { message: "Card created successfully"},
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { message: "Server error", error: error.message },
            { status: 500 }
        );
    }
}