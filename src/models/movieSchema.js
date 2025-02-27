import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    trailerUrl: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['showing_now', 'coming_soon'],
        required: true
    }
});

const Movie = mongoose.model('Movie', movieSchema);



export default Movie;