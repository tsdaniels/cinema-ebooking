// /app/api/showtimes/[id]/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../libs/mongodb';
import { Showtime } from '../../../../models/showtimeSchema';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  // Use params.id instead of params.showtimeId
  const showtimeId = params.id;
  
  console.log(`Fetching showtime with ID: ${showtimeId}`);
  
  try {
    await connectMongoDB();
    
    // Fetch the specific showtime from MongoDB by ID
    const showtime = await Showtime.findById(showtimeId)
      .populate('movie')
      .populate('theater');
    
    console.log(`Showtime found: ${showtime ? 'yes' : 'no'}`);
    
    if (!showtime) {
      return NextResponse.json(
        { error: "Showtime not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(showtime);
  } catch (error) {
    console.error("Database error fetching showtime:", error);
    return NextResponse.json(
      { error: "Failed to fetch showtime details" },
      { status: 500 }
    );
  }
}