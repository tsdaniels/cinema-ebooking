// File: app/api/movies/route.js
import { NextResponse } from 'next/server';
import connectDB from '../../../libs/mongodb';
import { Movie } from '../../../models/movieSchema';

export async function GET() {
  try {
    await connectDB();
    const movies = await Movie.find();
    return NextResponse.json(movies, { status: 200 });
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
    const { title, year, trailerUrl, posterUrl, synopsis, duration, status, director, producer, rating, cast } = await request.json();
    
    const newMovie = new Movie({ title, year, trailerUrl, posterUrl, synopsis, duration, status, director, producer, rating, cast });
    await newMovie.save();
    
    

    return NextResponse.json(
      { message: "Movie added successfully", newMovie },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }

  

}