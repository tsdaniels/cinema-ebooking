import mongoose from 'mongoose';

const castSchema = new mongoose.Schema({
    name: { type: String, required: true }
}, { _id: false });

const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    year: { type: String, required: true },
    trailerUrl: { type: String, required: false },
    posterUrl: { type: String, required: false },
    synopsis: { type: String, required: true },
    duration: { type: String, required: true },
    status: {
        type: String,
        enum: ['showing_now', 'coming_soon'],
        default: 'showing_now'
    },
    rating: {
        type: String,
        enum: ['G', 'PG', 'PG-13', 'R', 'NC-17'],
        required: true
    },
    // Add genres array to the schema
    genres: {
        type: [String],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0; // At least one genre is required
            },
            message: 'At least one genre is required'
        }
    },
    director: { type: String, required: true },
    producer: { type: String, required: true },
    cast: {
        type: [castSchema],
        required: true,
        validate: {
            validator: function(v) {
                return v.length > 0; // At least one cast member is required
            },
            message: 'At least one cast member is required'
        }
    }
}, { timestamps: true });

const Movie = mongoose.models.Movie || mongoose.model('Movie', movieSchema);

export default Movie;