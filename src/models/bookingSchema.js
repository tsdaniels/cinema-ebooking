// models/bookingSchema.js
import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true }
}, { _id: false });

const ticketsSchema = new mongoose.Schema({
  adult: { type: Number, default: 0 },
  child: { type: Number, default: 0 },
  senior: { type: Number, default: 0 }
}, { _id: false });

const paymentInfoSchema = new mongoose.Schema({
  cardNumber: { type: String, required: true }, // Last 4 digits only for security
  cardExpiry: { type: String, required: true }
}, { _id: false });

const bookingSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: false // Optional for guest bookings
  },
  movieId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Movie',
    required: true 
  },
  showtimeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Showtime',
    required: true 
  },
  seats: [seatSchema],
  tickets: ticketsSchema,
  totalPrice: { 
    type: Number, 
    required: true 
  },
  paymentInfo: paymentInfoSchema,
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  bookingDate: { 
    type: Date, 
    default: Date.now 
  },
  status: { 
    type: String, 
    enum: ['confirmed', 'cancelled', 'completed'],
    default: 'confirmed'
  }
}, { 
  collection: 'bookings',
  timestamps: true 
});

// Add indexes for common lookups
bookingSchema.index({ userId: 1 });
bookingSchema.index({ movieId: 1 });
bookingSchema.index({ showtimeId: 1 });
bookingSchema.index({ bookingDate: -1 });

export const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);