import { NextResponse } from 'next/server';
import connectDB from '@/libs/mongodb';
import { Card } from '@/models/paymentSchema';

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