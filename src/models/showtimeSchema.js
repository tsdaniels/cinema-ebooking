// models/showtimeSchema.js
import mongoose from 'mongoose';

const showtimeSchema = new mongoose.Schema({
    movieId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Movie',
        required: true 
    },
    date: { type: String, required: true },
    time: { type: String, required: true },
    auditorium: { type: String, required: true },
    price: { type: String, required: true }
}, { collection: 'showtimes' });

export const Showtime = mongoose.models.Showtime || mongoose.model('Showtime', showtimeSchema);