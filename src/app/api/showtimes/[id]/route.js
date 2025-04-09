// app/api/showtimes/[id]/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../../libs/mongodb';
import { Showtime } from '../../../../models/showtimeSchema';

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const deletedShowtime = await Showtime.findByIdAndDelete(id);
    
    if (!deletedShowtime) {
      return NextResponse.json(
        { message: "Showtime not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { message: "Showtime deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    
    const showtimes = await Showtime.find({ movieId: id });
    
    return NextResponse.json(showtimes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}