// /api/movies/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '../../../libs/mongodb';
import Movie from '../../../models/movieSchema';

// Handle GET request to fetch all movies
export async function GET() {
  try {
    await connectMongoDB();
    const movies = await Movie.find({});
    return NextResponse.json(movies);
  } catch (error) {
    console.error('Error fetching movies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch movies' },
      { status: 500 }
    );
  }
}

// Handle POST request to create a new movie
export async function POST(request) {
  try {
    const {
      title,
      year,
      trailerUrl,
      posterUrl,
      synopsis,
      duration,
      status,
      rating,
      director,
      producer,
      genres, 
      cast
    } = await request.json();

    // Validate required fields
    if (!title || !synopsis || !duration || !rating || !director || !producer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate that genres is an array with at least one genre
    if (!genres || !Array.isArray(genres) || genres.length === 0) {
      return NextResponse.json(
        { error: 'At least one genre is required' },
        { status: 400 }
      );
    }

    // Validate that cast is an array with at least one member
    if (!cast || !Array.isArray(cast) || cast.length === 0) {
      return NextResponse.json(
        { error: 'At least one cast member is required' },
        { status: 400 }
      );
    }

    await connectMongoDB();

    // Create the new movie
    const newMovie = new Movie({
      title,
      year,
      trailerUrl,
      posterUrl,
      synopsis,
      duration,
      status,
      rating,
      director,
      producer,
      genres, 
      cast
    });

    await newMovie.save();

    return NextResponse.json(
      { success: true, message: 'Movie created successfully', movie: newMovie },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating movie:', error);
    return NextResponse.json(
      { error: `Failed to create movie: ${error.message}` },
      { status: 500 }
    );
  }
}