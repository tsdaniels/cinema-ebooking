// models/movieSchema.js
import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    trailerUrl: { type: String },
    posterUrl: { type: String, default: undefined },
    synopsis: {type: String, trim: true},
    duration: {type: String, trim: true},
    status: { type: String, enum: ['showing_now', 'coming_soon'] },
    cast: {
        type: [{
            name: { type: String }
        }]},
}, { collection: 'movies' });

export const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);