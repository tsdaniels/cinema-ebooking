"use client";
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function CheckoutSuccess() {
  const router = useRouter();
<<<<<<< HEAD
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/checkAuth');
        const data = await response.json();

        if (data.isLoggedIn) {
          setIsLoggedIn(true);
          const storedOrder = localStorage.getItem('orderDetails');
          if (storedOrder) {
            setOrderDetails(JSON.parse(storedOrder));
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setError("Authentication failed. Please log in again.");
      }
    }
    checkAuth();
  }, [router]);

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-br from-black via-red-950 to-red-900 text-white">
      <div className="text-center bg-black/90 border border-green-500 p-6 rounded-lg shadow-xl">
        <h1 className="text-4xl font-bold text-green-400">Payment Successful! 🎉</h1>
        <p className="mt-4 text-lg">Thank you for your purchase.</p>
        
        {orderDetails ? (
          <div className="bg-black/90 border border-green-500 p-6 rounded-lg shadow-lg w-full max-w-md mx-auto mt-4">
            <h2 className="text-xl font-bold text-green-400">🎟️ Order Receipt</h2>
            <p className="mt-2"><strong>Movie:</strong> {orderDetails.movieTitle}</p>
            <p><strong>Showtime:</strong> {orderDetails.showtime}</p>
            <p><strong>Seats:</strong> {orderDetails.selectedSeats.join(', ') || 'No seats selected'}</p>

            <h3 className="mt-4 font-semibold">Tickets</h3>
            {Object.entries(orderDetails.tickets).map(([type, count]) =>
              count > 0 && (
                <p key={type}>{count} x {type} (${(count * orderDetails.ticketPrices[type]).toFixed(2)})</p>
              )
            )}

            <h3 className="mt-4 font-bold text-lg">Total Paid: ${orderDetails.totalPrice.toFixed(2)}</h3>
          </div>
        ) : (
          <p>Loading receipt...</p>
        )}

        <button onClick={() => router.push(isLoggedIn ? '/home' : '/')} 
          className="mt-6 px-6 py-3 bg-green-700 text-white font-bold rounded-md hover:bg-green-600 transition"
=======
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('bookingId');
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function fetchBookingDetails() {
      if (!bookingId) {
        setError("No booking ID provided");
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch(`/api/bookings/${bookingId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch booking details');
        }
        
        const data = await response.json();
        setBooking(data);
      } catch (err) {
        console.error('Error fetching booking:', err);
        setError('Unable to load your booking details. Please check your email for confirmation.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookingDetails();
  }, [bookingId]);
  
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading your booking confirmation...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <button 
          onClick={() => router.push('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
>>>>>>> Simone
        >
          Return to Home
        </button>
      </div>
    );
  }
  
  // Even if booking is null, show a basic success message
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-6">
        <p className="font-bold text-green-700">Booking Confirmed!</p>
        <p className="text-green-600">Your tickets have been booked successfully.</p>
      </div>
      
      <h1 className="text-2xl font-bold mb-6">Booking Confirmation</h1>
      
      {booking ? (
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="border-b pb-4 mb-4">
            <p className="text-gray-500 text-sm">Booking Reference</p>
            <p className="font-mono text-lg">{booking._id}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="font-bold text-lg mb-2">Movie Details</h2>
              <p className="font-medium">{booking.movieTitle || "Movie information unavailable"}</p>
              <p className="text-gray-600">
                {booking.showtimeDate && new Date(booking.showtimeDate).toLocaleDateString()}{' '}
                {booking.showtimeTime && `at ${booking.showtimeTime}`}
              </p>
              <p className="text-gray-600">{booking.auditorium || "Auditorium information unavailable"}</p>
            </div>
            
            <div>
              <h2 className="font-bold text-lg mb-2">Ticket Information</h2>
              <div className="space-y-1">
                {booking.tickets?.adult > 0 && (
                  <p>Adult tickets: {booking.tickets.adult}</p>
                )}
                {booking.tickets?.child > 0 && (
                  <p>Child tickets: {booking.tickets.child}</p>
                )}
                {booking.tickets?.senior > 0 && (
                  <p>Senior tickets: {booking.tickets.senior}</p>
                )}
              </div>
              
              <h3 className="font-medium mt-4 mb-1">Selected Seats</h3>
              <div className="flex flex-wrap gap-2">
                {booking.seats?.map((seat, index) => (
                  <span key={index} className="bg-gray-200 px-2 py-1 rounded text-sm">
                    {seat.seatNumber || seat}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t">
            <div className="flex justify-between font-bold">
              <span>Total Amount Paid</span>
              <span>${booking.totalPrice?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              A confirmation has been sent to your email: {booking.customerEmail}
            </p>
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Return to Home
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <p className="text-center mb-4">Your booking has been confirmed with reference ID: {bookingId}</p>
          <p className="text-center text-gray-600 mb-6">A confirmation email has been sent to your email address.</p>
          
          <div className="text-center">
            <button 
              onClick={() => router.push('/')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}