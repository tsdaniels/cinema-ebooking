import { NextResponse } from 'next/server';
import connectMongoDB from '../../../../libs/mongodb';
import { Booking } from '../../../../models/bookingSchema';
import mongoose from 'mongoose';
import { sendBookingConfirmation } from '../../email/orderConfirmation/route';

export async function GET(request, { params }) {
  const bookingId = params.id; // since the file is named [id], we use params.id
  console.log('Received bookingId:', bookingId);

  if (!bookingId) {
    return NextResponse.json(
      { error: 'Booking ID is required' },
      { status: 400 }
    );
  }

  if (!mongoose.Types.ObjectId.isValid(bookingId)) {
    return NextResponse.json(
      { error: 'Invalid booking ID format' },
      { status: 400 }
    );
  }

  try {
    await connectMongoDB();
    console.log('✅ Connected to MongoDB');

    const booking = await Booking.findById(bookingId)
      .populate('movieId', 'title')
      .populate('showtimeId', 'date time auditorium');

    if (!booking) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const bookingData = {
      _id: booking._id,
      movieId: booking.movieId?._id,
      movieTitle: booking.movieId?.title || 'Movie information unavailable',
      showtimeId: booking.showtimeId?._id,
      showtimeDate: booking.showtimeId?.date,
      showtimeTime: booking.showtimeId?.time,
      auditorium: booking.showtimeId?.auditorium,
      seats: booking.seats,
      tickets: booking.tickets,
      totalPrice: booking.totalPrice,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      bookingDate: booking.bookingDate || booking.createdAt,
      status: booking.status,
    };

    await sendBookingConfirmation(booking.customerEmail, bookingId);

    return NextResponse.json(bookingData);
  } catch (error) {
    console.error('❌ Error fetching booking:', error);
    return NextResponse.json(
      { error: 'Failed to fetch booking details', details: error.message },
      { status: 500 }
    );
  }
}
