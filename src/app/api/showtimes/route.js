// app/api/showtimes/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../libs/mongodb';
import { Showtime } from '../../../models/showtimeSchema';

export async function GET() {
  try {
    await connectDB();
    const showtimes = await Showtime.find();
    return NextResponse.json(showtimes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { movieId, date, time, auditorium, price } = await request.json();
    
    const newShowtime = new Showtime({ 
      movieId, 
      date, 
      time, 
      auditorium, 
      price 
    });
    await newShowtime.save();
    
    return NextResponse.json(
      { message: "Showtime added successfully", newShowtime },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}