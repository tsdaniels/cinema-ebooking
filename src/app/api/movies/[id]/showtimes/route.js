// /api/movies/[id]/showtimes/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../../libs/mongodb';
import { Showtime } from '../../../../../models/showtimeSchema';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  // Use params.id instead of params.movieId
  const movieId = params.id;
  
  console.log(`Looking for showtimes with movieId: ${movieId}`);
  
  try {
    await connectMongoDB();
    
    // Debug existing showtimes
    const allShowtimes = await Showtime.find().limit(5);
    console.log(`Found ${allShowtimes.length} total showtimes in database`);
    allShowtimes.forEach(s => {
      console.log(`- Showtime: ${s._id}, movieId: ${s.movieId}`);
    });
    
    // Try both string and ObjectId query formats
    let showtimes = [];
    
    if (mongoose.Types.ObjectId.isValid(movieId)) {
      const objId = new mongoose.Types.ObjectId(movieId);
      showtimes = await Showtime.find({ movieId: objId });
      console.log(`Found ${showtimes.length} showtimes with ObjectId query`);
    }
    
    // If no results with ObjectId, try string ID
    if (showtimes.length === 0) {
      showtimes = await Showtime.find({ movieId: movieId });
      console.log(`Found ${showtimes.length} showtimes with string ID query`);
    }
    
    if (!showtimes || showtimes.length === 0) {
      // For development, you can uncomment this to add mock data
      /*
      if (process.env.NODE_ENV === 'development') {
        console.log("Adding mock showtimes for testing");
        showtimes = [
          {
            _id: "mockid1",
            movieId: movieId,
            date: "2025-04-15",
            time: "7:30 PM",
            auditorium: "Auditorium 1",
            price: "12.99"
          },
          {
            _id: "mockid2",
            movieId: movieId,
            date: "2025-04-16",
            time: "3:45 PM",
            auditorium: "Auditorium 2",
            price: "10.99"
          }
        ];
        return NextResponse.json(showtimes);
      }
      */
      
      return NextResponse.json(
        { error: "No showtimes found for this movie" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(showtimes);
  } catch (error) {
    console.error("Error fetching showtimes:", error);
    return NextResponse.json(
      { error: "Failed to fetch showtimes: " + error.message },
      { status: 500 }
    );
  }
}