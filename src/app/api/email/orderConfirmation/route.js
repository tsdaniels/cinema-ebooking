import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import connectMongoDB from '../../../../libs/mongodb';
import { Booking } from '../../../../models/bookingSchema';

export async function sendBookingConfirmation(email, bookingId) {
  try {
    
    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email address is required',
        },
        { status: 400 }
      );
    }

    await connectMongoDB();

    const booking = await Booking.findById(bookingId)
      .populate('movieId', 'title')
      .populate('showtimeId', 'date time auditorium')
      .lean();

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: 'Booking not found',
        },
        { status: 404 }
      );
    }

    // Set up email transport
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Configure email options
    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: '🎟️ Your Booking Confirmation',
      html: `
        <h2>Thank you for your booking, ${booking.customerName || 'Guest'}!</h2>
        <p><strong>Movie:</strong> ${booking.movieId?.title || 'Unknown'}</p>
        <p><strong>Showtime:</strong> ${booking.showtimeId?.date} at ${booking.showtimeId?.time}</p>
        <p><strong>Auditorium:</strong> ${booking.showtimeId?.auditorium}</p>
        <p><strong>Seats:</strong> ${booking.seats?.map(s => s.seatNumber || s).join(', ')}</p>
        <p><strong>Total Paid:</strong> $${booking.totalPrice?.toFixed(2)}</p>
        <p>Your booking reference is <strong>${booking._id}</strong>.</p>
      `,
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return NextResponse.json({
      success: true,
      message: 'Booking email sent',
    });
  } catch (error) {
    console.error('Error sending booking email:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Error sending booking email',
        error: error.message
      },
      { status: 500 }
    );
  }
}