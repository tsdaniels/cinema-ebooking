// app/api/bookings/route.js
import { NextResponse } from 'next/server';
import connectMongoDB from '../../../libs/mongodb';
import { Booking } from '../../../models/bookingSchema';

export async function POST(request) {
  try {
    await connectMongoDB();

    // Parse the request body to extract booking details
    const { movieId, showtimeId, seats, tickets, totalPrice, paymentInfo, customerName, customerEmail, userId } = await request.json();
    
    // Validate required fields
    if (!movieId || !showtimeId || !seats || seats.length === 0 || !totalPrice || !customerName || !customerEmail) {
      return NextResponse.json(
        { message: "Missing required booking information" },
        { status: 400 }
      );
    }
    
    // Transform the seats from strings to objects with seatNumber property
    const formattedSeats = seats.map(seat => ({ seatNumber: seat }));
    
    // Create the new booking entry in the database
    const newBooking = new Booking({
      movieId,
      showtimeId,
      seats: formattedSeats, // Use the transformed seats array
      tickets,
      totalPrice,
      paymentInfo: {
        cardNumber: paymentInfo?.cardNumber ? paymentInfo.cardNumber : null,
        cardExpiry: paymentInfo?.cardExpiry || null,
      },
      customerName,
      customerEmail,
      userId // Include the userId if available
    });
    
    // Save the new booking to the database
    await newBooking.save();
    
    // Send a success response with the booking ID
    return NextResponse.json(
      { message: "Booking created successfully", bookingId: newBooking._id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Booking error:", error);
    
    // Return a detailed error response in case of server issues
    return NextResponse.json(
      { message: "Server error", error: error.message },
      { status: 500 }
    );
  }
}