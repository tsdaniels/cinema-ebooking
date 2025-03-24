import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Card } from '@/models/paymentSchema';

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
    
    // Find all cards under provided email
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
    
    return NextResponse.json(
      { card, success: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}