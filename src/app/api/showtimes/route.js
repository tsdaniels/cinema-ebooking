// /api/showtimes/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '../../../libs/mongodb';
import { Showtime } from '../../../models/showtimeSchema';

// Function to check if there's a scheduling conflict
async function hasSchedulingConflict(newShowtime) {
  const { date, time, auditorium } = newShowtime;
  
  // Define a time buffer (in minutes) before and after each showtime to allow for theater clearing
  const BUFFER_MINUTES = 30;
  
  // Convert time string to minutes since midnight for easier comparison
  const convertTimeToMinutes = (timeStr) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };
  
  const newShowtimeMinutes = convertTimeToMinutes(time);
  
  // Find any showtimes on the same date in the same auditorium
  const existingShowtimes = await Showtime.find({ 
    date: date,
    auditorium: auditorium
  });
  
  // Check for time conflicts including buffer
  for (const existing of existingShowtimes) {
    const existingMinutes = convertTimeToMinutes(existing.time);
    
    // Simple overlap check with buffer
    // If the new showtime is too close to an existing one, return true (conflict)
    if (Math.abs(existingMinutes - newShowtimeMinutes) < BUFFER_MINUTES) {
      return {
        hasConflict: true,
        conflictShowtime: existing
      };
    }
  }
  
  return { hasConflict: false };
}

// Handle GET request for all showtimes
export async function GET() {
  try {
    await connectMongoDB();
    const showtimes = await Showtime.find({});
    return NextResponse.json(showtimes);
  } catch (error) {
    console.error('Error fetching showtimes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch showtimes' },
      { status: 500 }
    );
  }
}

// Handle POST request to create a new showtime
export async function POST(request) {
  try {
    const { movieId, date, time, auditorium, price } = await request.json();

    // Validate required fields
    if (!movieId || !date || !time || !auditorium || !price) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    await connectMongoDB();
    
    // Check for scheduling conflicts
    const conflict = await hasSchedulingConflict({ date, time, auditorium });
    if (conflict.hasConflict) {
      return NextResponse.json(
        { 
          error: 'Scheduling conflict detected', 
          message: `There is already a scheduled movie in Auditorium ${auditorium} at ${time} on ${new Date(date).toLocaleDateString()}. Please choose a different time or auditorium.`,
          conflictDetails: conflict.conflictShowtime
        },
        { status: 409 } // HTTP 409 Conflict
      );
    }

    // Create new showtime if no conflicts
    const newShowtime = new Showtime({
      movieId,
      date,
      time,
      auditorium,
      price
    });

    await newShowtime.save();

    return NextResponse.json(
      { message: 'Showtime created successfully', showtime: newShowtime },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating showtime:', error);
    return NextResponse.json(
      { error: `Failed to create showtime: ${error.message}` },
      { status: 500 }
    );
  }
}