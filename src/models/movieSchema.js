// models/movieSchema.js
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    trailerUrl: { type: String, required: true },
    status: { type: String, enum: ['showing_now', 'coming_soon'], required: true }
}, { collection: 'movies' });

export const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);